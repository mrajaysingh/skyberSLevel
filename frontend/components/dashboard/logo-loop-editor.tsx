"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Plus, X, Save, Image as ImageIcon, Eye, EyeOff, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast-provider";
import { Slider } from "@/components/ui/slider";
import { uploadImageToS3 } from "@/lib/image-upload";

interface LogoItem {
  id: string;
  name: string;
  title: string;
  href: string;
  svg: string;
  imageUrl?: string;
}

interface LogoLoopConfig {
  enabled: boolean;
  logos: LogoItem[];
  speed: number;
  gap: number;
  logoHeight: number;
  sectionHeight: number;
  direction: "left" | "right" | "up" | "down";
  pauseOnHover: boolean;
  scaleOnHover: boolean;
  fadeOut: boolean;
}

interface LogoLoopEditorProps {
  onConfigChange?: (config: LogoLoopConfig) => void;
}

export function LogoLoopEditor({ onConfigChange }: LogoLoopEditorProps) {
  const [config, setConfig] = useState<LogoLoopConfig>({
    enabled: true,
    logos: [],
    speed: 120,
    gap: 40,
    logoHeight: 53,
    sectionHeight: 80,
    direction: "right",
    pauseOnHover: true,
    scaleOnHover: true,
    fadeOut: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [newLogo, setNewLogo] = useState({ name: "", title: "", href: "", svg: "", imageUrl: "" });
  const [svgCode, setSvgCode] = useState("");
  const [isLogosOpen, setIsLogosOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { showSuccess, showError } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Load config function
  const loadCurrentConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/api/site-config/current`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data.success && data.data.logoLoop) {
            setConfig(data.data.logoLoop);
          }
        }
      }
    } catch (error) {
      console.error('Error loading logo loop config:', error);
    }
  };

  // Load config on mount
  useEffect(() => {
    loadCurrentConfig();
  }, [API_URL]);

  // Notify parent of config changes
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange(config);
    }
  }, [config, onConfigChange]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showError('File Too Large', 'Logo image must be less than 2MB');
      return;
    }

    setIsUploadingLogo(true);
    try {
      // Validate dimensions first
      const reader = new FileReader();
      reader.onloadend = async () => {
        const img = new Image();
        img.onload = async () => {
          if (img.width > 500 || img.height > 500) {
            showError('Image Too Large', 'Logo should be max 500x500 pixels');
            setIsUploadingLogo(false);
            return;
          }

          // Upload to S3
          const logoKey = newLogo.name || `logo-${Date.now()}`;
          const result = await uploadImageToS3({
            category: 'edit-page',
            subcategory: 'logo-loop',
            imageKey: logoKey,
            file
          });

          if (result.success && result.url) {
            setNewLogo({ ...newLogo, imageUrl: result.url });
            showSuccess('Success', 'Logo uploaded to S3 successfully');
          } else {
            showError('Upload Failed', result.error || 'Failed to upload logo');
          }
          setIsUploadingLogo(false);
        };
        img.onerror = () => {
          showError('Invalid Image', 'Failed to load image');
          setIsUploadingLogo(false);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      showError('Upload Failed', error.message || 'Failed to upload logo');
      setIsUploadingLogo(false);
    }
  };

  const handleAddLogo = () => {
    if (!newLogo.name.trim() || (!newLogo.svg.trim() && !newLogo.imageUrl)) {
      showError('Missing Fields', 'Please provide logo name and either SVG code or image');
      return;
    }

    const logo: LogoItem = {
      id: Date.now().toString(),
      name: newLogo.name.trim(),
      title: newLogo.title.trim() || newLogo.name.trim(),
      href: newLogo.href.trim() || "#",
      svg: newLogo.svg.trim(),
      imageUrl: newLogo.imageUrl || undefined,
    };

    setConfig({
      ...config,
      logos: [...config.logos, logo]
    });

    setNewLogo({ name: "", title: "", href: "", svg: "", imageUrl: "" });
    setSvgCode("");
    showSuccess('Logo Added', 'Logo has been added successfully');
  };

  const handlePasteSvg = () => {
    if (svgCode.trim()) {
      setNewLogo({ ...newLogo, svg: svgCode.trim() });
      setSvgCode("");
      showSuccess('SVG Pasted', 'SVG code has been pasted');
    }
  };

  const handleRemoveLogo = (id: string) => {
    setConfig({
      ...config,
      logos: config.logos.filter(logo => logo.id !== id)
    });
    showSuccess('Logo Removed', 'Logo has been removed');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      if (!sessionToken) {
        showError('Authentication Error', 'Please log in to save changes');
        return;
      }

      const response = await fetch(`${API_URL}/api/site-config/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({
          logoLoop: config
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      const result = await response.json();
      if (result.success) {
        showSuccess('Saved Successfully', 'Logo loop configuration has been saved');
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('logoLoopConfigUpdated'));
        // Reload config from server to ensure persistence
        await loadCurrentConfig();
      } else {
        throw new Error(result.message || 'Failed to save');
      }
    } catch (error: any) {
      console.error("Error saving logo loop config:", error);
      if (error.message === 'Failed to fetch') {
        showError('Connection Error', 'Cannot connect to the backend server. Please ensure it is running on port 3001.');
      } else {
        showError('Save Failed', 'An error occurred while saving');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Logo Loop Section</CardTitle>
              <CardDescription>Manage technology stack logos display</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setConfig({ ...config, enabled: !config.enabled })}
              className={cn(
                "h-10 w-10",
                config.enabled ? "text-green-600" : "text-gray-400"
              )}
            >
              {config.enabled ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </Button>
          </div>
        </CardHeader>
        {config.enabled && (
          <CardContent className="space-y-6">
            {/* Logo Management */}
            <Card>
              <CardHeader className="cursor-pointer" onClick={() => setIsLogosOpen(!isLogosOpen)}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Logos</CardTitle>
                    <CardDescription>Add, edit, or remove logos</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLogosOpen(!isLogosOpen);
                    }}
                  >
                    {isLogosOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </Button>
                </div>
              </CardHeader>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isLogosOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <CardContent className="space-y-4">
                  {/* Available Logos */}
                  {config.logos.length > 0 && (
                    <div className="space-y-2">
                      <Label>Available Logos ({config.logos.length})</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {config.logos.map((logo) => (
                          <div
                            key={logo.id}
                            className="relative p-4 border rounded-lg bg-card"
                          >
                            <div className="flex items-center justify-center h-20 mb-2 bg-muted rounded">
                              {logo.svg ? (
                                <div
                                  className="w-full h-full flex items-center justify-center"
                                  dangerouslySetInnerHTML={{ __html: logo.svg }}
                                />
                              ) : logo.imageUrl ? (
                                <img
                                  src={logo.imageUrl}
                                  alt={logo.name}
                                  className="max-w-full max-h-full object-contain"
                                />
                              ) : (
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                              )}
                            </div>
                            <p className="text-sm font-medium text-center truncate">{logo.name}</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-2 right-2 h-6 w-6 text-destructive"
                              onClick={() => handleRemoveLogo(logo.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add New Logo */}
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <Label>Add New Logo</Label>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="logo-name">Logo Name *</Label>
                        <Input
                          id="logo-name"
                          value={newLogo.name}
                          onChange={(e) => setNewLogo({ ...newLogo, name: e.target.value })}
                          placeholder="e.g., React, Docker"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="logo-title">Display Title</Label>
                        <Input
                          id="logo-title"
                          value={newLogo.title}
                          onChange={(e) => setNewLogo({ ...newLogo, title: e.target.value })}
                          placeholder="Optional display title"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logo-href">Link URL</Label>
                      <Input
                        id="logo-href"
                        value={newLogo.href}
                        onChange={(e) => setNewLogo({ ...newLogo, href: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>

                    {/* SVG Code Paste */}
                    <div className="space-y-2">
                      <Label htmlFor="svg-code">Paste SVG Code</Label>
                      <div className="flex gap-2">
                        <Input
                          id="svg-code"
                          value={svgCode}
                          onChange={(e) => setSvgCode(e.target.value)}
                          placeholder="Paste SVG code here..."
                          className="font-mono text-xs"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handlePasteSvg}
                          disabled={!svgCode.trim()}
                        >
                          Paste
                        </Button>
                      </div>
                      {newLogo.svg && (
                        <div className="p-2 bg-background border rounded">
                          <div className="flex items-center justify-center h-16">
                            <div
                              className="w-full h-full flex items-center justify-center"
                              dangerouslySetInnerHTML={{ __html: newLogo.svg }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">SVG Preview</p>
                        </div>
                      )}
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="logo-upload">Or Upload Image (Max 500x500px, 2MB)</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="cursor-pointer"
                          disabled={isUploadingLogo}
                        />
                        {isUploadingLogo && (
                          <span className="text-xs text-muted-foreground">Uploading to S3...</span>
                        )}
                        {newLogo.imageUrl && (
                          <div className="relative w-20 h-20 border rounded">
                            <img
                              src={newLogo.imageUrl}
                              alt="Preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={handleAddLogo}
                      disabled={!newLogo.name.trim() || (!newLogo.svg.trim() && !newLogo.imageUrl)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Logo
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader className="cursor-pointer" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Adjust animation and display settings</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsSettingsOpen(!isSettingsOpen);
                    }}
                  >
                    {isSettingsOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </Button>
                </div>
              </CardHeader>
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  isSettingsOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <CardContent className="space-y-4">
                  {/* Speed */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Animation Speed: {config.speed}px/s</Label>
                    </div>
                    <Slider
                      value={[config.speed]}
                      onValueChange={(value) => setConfig({ ...config, speed: value[0] })}
                      min={20}
                      max={300}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  {/* Gap */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Gap Between Logos: {config.gap}px</Label>
                    </div>
                    <Slider
                      value={[config.gap]}
                      onValueChange={(value) => setConfig({ ...config, gap: value[0] })}
                      min={10}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Logo Height */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Logo Height: {config.logoHeight}px</Label>
                    </div>
                    <Slider
                      value={[config.logoHeight]}
                      onValueChange={(value) => setConfig({ ...config, logoHeight: value[0] })}
                      min={20}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Section Height */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Section Height: {config.sectionHeight}px</Label>
                    </div>
                    <Slider
                      value={[config.sectionHeight]}
                      onValueChange={(value) => setConfig({ ...config, sectionHeight: value[0] })}
                      min={40}
                      max={200}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Direction */}
                  <div className="space-y-2">
                    <Label>Animation Direction</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["left", "right", "up", "down"] as const).map((dir) => (
                        <Button
                          key={dir}
                          variant={config.direction === dir ? "default" : "outline"}
                          onClick={() => setConfig({ ...config, direction: dir })}
                          className="capitalize"
                        >
                          {dir}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Toggle Options */}
                  <div className="space-y-2">
                    <Label>Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pause-hover" className="font-normal">Pause on Hover</Label>
                        <input
                          id="pause-hover"
                          type="checkbox"
                          checked={config.pauseOnHover}
                          onChange={(e) => setConfig({ ...config, pauseOnHover: e.target.checked })}
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="scale-hover" className="font-normal">Scale on Hover</Label>
                        <input
                          id="scale-hover"
                          type="checkbox"
                          checked={config.scaleOnHover}
                          onChange={(e) => setConfig({ ...config, scaleOnHover: e.target.checked })}
                          className="h-4 w-4"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="fade-out" className="font-normal">Fade Out Edges</Label>
                        <input
                          id="fade-out"
                          type="checkbox"
                          checked={config.fadeOut}
                          onChange={(e) => setConfig({ ...config, fadeOut: e.target.checked })}
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Save Button - Optional, can use global save instead */}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full"
              size="lg"
              variant="outline"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save This Section Only"}
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

