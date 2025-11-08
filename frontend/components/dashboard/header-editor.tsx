"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Plus, X, Save, Image as ImageIcon, History, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast-provider";

interface NavigationLink {
  id: string;
  label: string;
  href: string;
  order: number;
}

interface HeaderConfig {
  logoUrl: string;
  siteName: string;
  navigationLinks: NavigationLink[];
  headerBgColor: string;
  headerTextColor: string;
  stickyHeader: boolean;
}

export function HeaderEditor() {
  const [config, setConfig] = useState<HeaderConfig>({
    logoUrl: "/favicon.svg",
    siteName: "SKYBER",
    navigationLinks: [
      { id: "1", label: "About Us", href: "#about", order: 1 },
      { id: "2", label: "Demo", href: "/demo", order: 2 },
      { id: "3", label: "Insights", href: "#insights", order: 3 },
      { id: "4", label: "Blogs", href: "#blogs", order: 4 },
      { id: "5", label: "Policies", href: "/policies", order: 5 },
      { id: "6", label: "Contact Us", href: "#contact", order: 6 },
    ],
    headerBgColor: "#ffffff",
    headerTextColor: "#000000",
    stickyHeader: true,
  });

  const [newLink, setNewLink] = useState({ label: "", href: "" });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [backups, setBackups] = useState<any[]>([]);
  const [selectedBackup, setSelectedBackup] = useState<string>("");
  const [isRestoring, setIsRestoring] = useState(false);
  const { showSuccess, showError } = useToast();
  
  // Collapsible section states (all collapsed by default)
  const [isLogoBrandingOpen, setIsLogoBrandingOpen] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isStylingOpen, setIsStylingOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
        setConfig({ ...config, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddLink = () => {
    if (newLink.label && newLink.href) {
      const newNavLink: NavigationLink = {
        id: Date.now().toString(),
        label: newLink.label,
        href: newLink.href,
        order: config.navigationLinks.length + 1,
      };
      setConfig({
        ...config,
        navigationLinks: [...config.navigationLinks, newNavLink],
      });
      setNewLink({ label: "", href: "" });
    }
  };

  const handleRemoveLink = (id: string) => {
    setConfig({
      ...config,
      navigationLinks: config.navigationLinks.filter((link) => link.id !== id),
    });
  };

  const handleUpdateLink = (id: string, field: "label" | "href", value: string) => {
    setConfig({
      ...config,
      navigationLinks: config.navigationLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      ),
    });
  };

  // Load current config and backups on mount
  useEffect(() => {
    loadCurrentConfig();
    loadBackups();
  }, []);

  const loadCurrentConfig = async () => {
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      if (!sessionToken) return;

      const response = await fetch(`${API_URL}/api/site-config/current`, {
        headers: { 'Authorization': `Bearer ${sessionToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.header) {
          setConfig(data.data.header);
        }
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const loadBackups = async () => {
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      if (!sessionToken) return;

      const response = await fetch(`${API_URL}/api/site-config/backups`, {
        headers: { 'Authorization': `Bearer ${sessionToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBackups(data.data || []);
        }
      } else {
        // If API fails, set empty backups array
        setBackups([]);
      }
    } catch (error) {
      console.error('Error loading backups:', error);
      // Set empty backups array on error
      setBackups([]);
    }
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
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ header: config }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccess('Saved Successfully', 'Header configuration saved and backup created');
        await loadBackups(); // Reload backups list
      } else {
        showError('Save Failed', data?.error || 'Failed to save configuration. Make sure the backend server is running.');
      }
    } catch (error: any) {
      console.error("Error saving header config:", error);
      if (error.message === 'Failed to fetch') {
        showError('Connection Error', 'Cannot connect to the backend server. Please ensure it is running on port 3001.');
      } else {
        showError('Save Failed', 'An error occurred while saving');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedBackup) {
      showError('No Backup Selected', 'Please select a backup to restore');
      return;
    }

    setIsRestoring(true);
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      if (!sessionToken) {
        showError('Authentication Error', 'Please log in to restore backups');
        return;
      }

      const response = await fetch(`${API_URL}/api/site-config/restore/${selectedBackup}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${sessionToken}` },
      });

      const data = await response.json();

      if (data.success) {
        showSuccess('Restored Successfully', 'Configuration restored from backup');
        await loadCurrentConfig(); // Reload current config
        await loadBackups(); // Reload backups list
        setSelectedBackup("");
      } else {
        showError('Restore Failed', data.error || 'Failed to restore from backup');
      }
    } catch (error) {
      console.error("Error restoring from backup:", error);
      showError('Restore Failed', 'An error occurred while restoring');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Logo & Branding */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setIsLogoBrandingOpen(!isLogoBrandingOpen)}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Logo & Branding</CardTitle>
              <CardDescription>Upload your site logo and set the site name</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsLogoBrandingOpen(!isLogoBrandingOpen);
              }}
            >
              {isLogoBrandingOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </Button>
          </div>
        </CardHeader>
        <div 
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isLogoBrandingOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="logo-upload">Site Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-secondary/50">
                {logoPreview || config.logoUrl ? (
                  <img
                    src={logoPreview || config.logoUrl}
                    alt="Logo preview"
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" asChild>
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </label>
                </Button>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: 200x200px, PNG or SVG
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input
              id="site-name"
              value={config.siteName}
              onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
              placeholder="Enter site name"
            />
          </div>
        </CardContent>
        </div>
      </Card>

      {/* Navigation Links */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setIsNavigationOpen(!isNavigationOpen)}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Navigation Links</CardTitle>
              <CardDescription>Manage your header navigation menu items</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsNavigationOpen(!isNavigationOpen);
              }}
            >
              {isNavigationOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </Button>
          </div>
        </CardHeader>
        <div 
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isNavigationOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {config.navigationLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-2 p-3 border rounded-lg bg-secondary/20"
              >
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input
                    value={link.label}
                    onChange={(e) => handleUpdateLink(link.id, "label", e.target.value)}
                    placeholder="Link Label"
                  />
                  <Input
                    value={link.href}
                    onChange={(e) => handleUpdateLink(link.id, "href", e.target.value)}
                    placeholder="Link URL"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveLink(link.id)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <Input
                value={newLink.label}
                onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                placeholder="New Link Label"
              />
              <Input
                value={newLink.href}
                onChange={(e) => setNewLink({ ...newLink, href: e.target.value })}
                placeholder="New Link URL"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddLink}
              disabled={!newLink.label || !newLink.href}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
        </div>
      </Card>

      {/* Header Styling */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setIsStylingOpen(!isStylingOpen)}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Header Styling</CardTitle>
              <CardDescription>Customize the appearance of your header</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                setIsStylingOpen(!isStylingOpen);
              }}
            >
              {isStylingOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </Button>
          </div>
        </CardHeader>
        <div 
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isStylingOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bg-color">Background Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="bg-color"
                  type="color"
                  value={config.headerBgColor}
                  onChange={(e) => setConfig({ ...config, headerBgColor: e.target.value })}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={config.headerBgColor}
                  onChange={(e) => setConfig({ ...config, headerBgColor: e.target.value })}
                  placeholder="#ffffff"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="text-color">Text Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="text-color"
                  type="color"
                  value={config.headerTextColor}
                  onChange={(e) => setConfig({ ...config, headerTextColor: e.target.value })}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={config.headerTextColor}
                  onChange={(e) => setConfig({ ...config, headerTextColor: e.target.value })}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CustomCheckbox
              id="sticky-header"
              checked={config.stickyHeader}
              onChange={(checked) => setConfig({ ...config, stickyHeader: checked })}
            />
            <Label htmlFor="sticky-header" className="cursor-pointer">
              Enable Sticky Header (stays visible when scrolling)
            </Label>
          </div>
        </CardContent>
        </div>
      </Card>

      {/* Backup & Restore */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => {}}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Backup & Restore
              </CardTitle>
              <CardDescription>Restore previous configurations from backups</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {backups.length > 0 ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="backup-select">Select Backup to Restore</Label>
                <div className="flex gap-2">
                  <Select value={selectedBackup} onValueChange={setSelectedBackup}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Choose a backup..." />
                    </SelectTrigger>
                    <SelectContent>
                      {backups.map((backup) => (
                        <SelectItem key={backup.filename} value={backup.filename}>
                          {new Date(backup.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                          {' '}- {backup.changeCount} change{backup.changeCount > 1 ? 's' : ''}
                          {' '}(Last: {new Date(backup.lastModified).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleRestore}
                    disabled={!selectedBackup || isRestoring}
                    variant="outline"
                    className="border-[#17D492] text-[#17D492] hover:bg-[#17D492] hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    {isRestoring ? "Restoring..." : "Restore"}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Restoring a backup will save your current configuration before applying the selected backup.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No backups available yet. Save your configuration to create the first backup.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#17D492] hover:bg-[#14c082] text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Header Settings"}
        </Button>
      </div>
    </div>
  );
}
