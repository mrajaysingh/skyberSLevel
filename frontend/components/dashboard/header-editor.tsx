"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Plus, X, Save, Image as ImageIcon, History, RotateCcw, Eye, EyeOff } from "lucide-react";
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
import { uploadImageToS3, getImageUrl } from "@/lib/image-upload";

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
  glassMorphismIntensity: number; // 0-100, controls opacity of glass effect
  headerTextColor: string; // Legacy support - kept for backward compatibility
  headerTextColorLight?: string; // Text color for light theme
  headerTextColorDark?: string; // Text color for dark theme
  stickyHeader: boolean;
  logoBrandingEnabled?: boolean;
  navigationEnabled?: boolean;
  stylingEnabled?: boolean;
}

interface HeaderEditorProps {
  onConfigChange?: (config: HeaderConfig) => void;
}

export function HeaderEditor({ onConfigChange }: HeaderEditorProps = {}) {
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
    glassMorphismIntensity: 40, // Default 40% opacity
    headerTextColor: "#000000", // Legacy - kept for backward compatibility
    headerTextColorLight: "#000000", // Default black for light theme
    headerTextColorDark: "#ffffff", // Default white for dark theme
    stickyHeader: true,
    logoBrandingEnabled: true,
    navigationEnabled: true,
    stylingEnabled: true,
  });

  const [newLink, setNewLink] = useState({ label: "", href: "" });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [backups, setBackups] = useState<any[]>([]);
  const [selectedBackup, setSelectedBackup] = useState<string>("");
  const [isRestoring, setIsRestoring] = useState(false);
  const { showSuccess, showError } = useToast();
  
  // Collapsible section states (all collapsed by default)
  const [isLogoBrandingOpen, setIsLogoBrandingOpen] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);
  const [isStylingOpen, setIsStylingOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to S3
      const result = await uploadImageToS3({
        category: 'edit-page',
        subcategory: 'header',
        imageKey: 'logo',
        file
      });

      if (result.success && result.url) {
        setConfig({ ...config, logoUrl: result.url });
        setLogoPreview(result.url);
        showSuccess('Success', 'Logo uploaded to S3 successfully');
      } else {
        showError('Upload Failed', result.error || 'Failed to upload logo');
      }
    } catch (error: any) {
      showError('Upload Failed', error.message || 'Failed to upload logo');
    } finally {
      setIsUploadingLogo(false);
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
    loadImageFromJson();
  }, []);

  // Load image from JSON storage
  const loadImageFromJson = async () => {
    try {
      const imageUrl = await getImageUrl('edit-page', 'header', 'logo');
      if (imageUrl) {
        setConfig(prev => ({ ...prev, logoUrl: imageUrl }));
        setLogoPreview(imageUrl);
      }
    } catch (error) {
      console.error('Error loading image from JSON:', error);
    }
  };

  // Notify parent of config changes
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange(config);
    }
  }, [config, onConfigChange]);

  const loadCurrentConfig = async () => {
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      if (!sessionToken) return;

      const response = await fetch(`${API_URL}/api/site-config/current`, {
        headers: { 'Authorization': `Bearer ${sessionToken}` },
      });

      if (response.ok) {
        // Check if response is JSON before parsing
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data.success && data.data.header) {
            const loadedConfig = data.data.header;
            // Handle backward compatibility: if headerBgColor exists but glassMorphismIntensity doesn't, set default
            if (!loadedConfig.glassMorphismIntensity && loadedConfig.headerBgColor) {
              loadedConfig.glassMorphismIntensity = 40; // Default intensity
            } else if (!loadedConfig.glassMorphismIntensity) {
              loadedConfig.glassMorphismIntensity = 40; // Default if neither exists
            }
            // Handle backward compatibility: if only headerTextColor exists, use it for both themes
            if (loadedConfig.headerTextColor && !loadedConfig.headerTextColorLight && !loadedConfig.headerTextColorDark) {
              loadedConfig.headerTextColorLight = loadedConfig.headerTextColor;
              loadedConfig.headerTextColorDark = loadedConfig.headerTextColor;
            } else {
              // Set defaults if not present
              if (!loadedConfig.headerTextColorLight) {
                loadedConfig.headerTextColorLight = "#000000";
              }
              if (!loadedConfig.headerTextColorDark) {
                loadedConfig.headerTextColorDark = "#ffffff";
              }
            }
            setConfig(loadedConfig);
          }
        }
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
  };

  const loadBackups = async () => {
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      if (!sessionToken) {
        setBackups([]);
        return;
      }

      let response: Response | null = null;
      try {
        response = await fetch(`${API_URL}/api/site-config/backups`, {
          headers: { 'Authorization': `Bearer ${sessionToken}` },
          cache: 'no-store',
        });
      } catch (fetchError) {
        // Handle network errors silently - backend might not be running
        console.warn('Could not load backups (backend may be offline):', fetchError);
        setBackups([]);
        return;
      }

      if (!response) {
        setBackups([]);
        return;
      }

      if (response.ok) {
        // Check if response is JSON before parsing
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          try {
            const data = await response.json();
            if (data.success) {
              setBackups(data.data || []);
            } else {
              setBackups([]);
            }
          } catch (parseError) {
            console.warn('Error parsing backups response:', parseError);
            setBackups([]);
          }
        } else {
          setBackups([]);
        }
      } else {
        // If API fails, set empty backups array
        setBackups([]);
      }
    } catch (error) {
      // Silently handle errors - don't break the UI if backups can't be loaded
      console.warn('Error loading backups (non-critical):', error);
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

      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        showError('Save Failed', 'Server returned invalid response. Please check if the backend is running.');
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccess('Saved Successfully', 'Header configuration saved and backup created');
        // Trigger header refresh by dispatching custom event
        window.dispatchEvent(new Event('headerConfigUpdated'));
        // Also reload current config to reflect changes
        await loadCurrentConfig();
        // Reload backups list (non-blocking, silent on error)
        loadBackups().catch(() => {
          // Silently ignore errors - backups loading is non-critical
        });
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

      // Check if response is JSON before parsing
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        showError('Restore Failed', 'Server returned invalid response. Please check if the backend is running.');
        return;
      }

      const data = await response.json();

      if (data.success) {
        showSuccess('Restored Successfully', 'Configuration restored from backup');
        await loadCurrentConfig(); // Reload current config
        // Reload backups list (non-blocking, silent on error)
        loadBackups().catch(() => {
          // Silently ignore errors - backups loading is non-critical
        });
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
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className={cn(
                  "h-8 w-8",
                  config.logoBrandingEnabled !== false ? "text-green-600" : "text-gray-400"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfig({ ...config, logoBrandingEnabled: !(config.logoBrandingEnabled !== false) });
                }}
              >
                {config.logoBrandingEnabled !== false ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </Button>
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
          </div>
        </CardHeader>
        {config.logoBrandingEnabled !== false && (
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
                <Button variant="outline" size="sm" asChild disabled={isUploadingLogo}>
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
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
        )}
      </Card>

      {/* Navigation Links */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setIsNavigationOpen(!isNavigationOpen)}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Navigation Links</CardTitle>
              <CardDescription>Manage your header navigation menu items</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className={cn(
                  "h-8 w-8",
                  config.navigationEnabled !== false ? "text-green-600" : "text-gray-400"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfig({ ...config, navigationEnabled: !(config.navigationEnabled !== false) });
                }}
              >
                {config.navigationEnabled !== false ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </Button>
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
          </div>
        </CardHeader>
        {config.navigationEnabled !== false && (
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
        )}
      </Card>

      {/* Header Styling */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setIsStylingOpen(!isStylingOpen)}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Header Styling</CardTitle>
              <CardDescription>Customize the appearance of your header</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className={cn(
                  "h-8 w-8",
                  config.stylingEnabled !== false ? "text-green-600" : "text-gray-400"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfig({ ...config, stylingEnabled: !(config.stylingEnabled !== false) });
                }}
              >
                {config.stylingEnabled !== false ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </Button>
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
          </div>
        </CardHeader>
        {config.stylingEnabled !== false && (
          <div 
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isStylingOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
          <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="glass-intensity">Glass Morphism Intensity</Label>
                <span className="text-sm text-muted-foreground">{config.glassMorphismIntensity}%</span>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <input
                    id="glass-intensity"
                    type="range"
                    min="0"
                    max="100"
                    value={config.glassMorphismIntensity}
                    onChange={(e) => setConfig({ ...config, glassMorphismIntensity: parseInt(e.target.value) })}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-[#17D492]"
                    style={{
                      background: `linear-gradient(to right, #17D492 0%, #17D492 ${config.glassMorphismIntensity}%, hsl(var(--muted)) ${config.glassMorphismIntensity}%, hsl(var(--muted)) 100%)`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Transparent (0%)</span>
                  <span>Opaque (100%)</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Adjust the intensity of the glass morphism effect. Lower values make the header more transparent, higher values make it more opaque.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text-color-light">Header Text Color (Light Theme)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="text-color-light"
                    type="color"
                    value={config.headerTextColorLight || config.headerTextColor || "#000000"}
                    onChange={(e) => setConfig({ 
                      ...config, 
                      headerTextColorLight: e.target.value,
                      headerTextColor: e.target.value // Keep legacy field in sync
                    })}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={config.headerTextColorLight || config.headerTextColor || "#000000"}
                    onChange={(e) => setConfig({ 
                      ...config, 
                      headerTextColorLight: e.target.value,
                      headerTextColor: e.target.value // Keep legacy field in sync
                    })}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Choose the text color for the header when using light theme
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text-color-dark">Header Text Color (Dark Theme)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="text-color-dark"
                    type="color"
                    value={config.headerTextColorDark || config.headerTextColor || "#ffffff"}
                    onChange={(e) => setConfig({ 
                      ...config, 
                      headerTextColorDark: e.target.value,
                      headerTextColor: e.target.value // Keep legacy field in sync
                    })}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    value={config.headerTextColorDark || config.headerTextColor || "#ffffff"}
                    onChange={(e) => setConfig({ 
                      ...config, 
                      headerTextColorDark: e.target.value,
                      headerTextColor: e.target.value // Keep legacy field in sync
                    })}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Choose the text color for the header when using dark theme
                </p>
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
        )}
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
