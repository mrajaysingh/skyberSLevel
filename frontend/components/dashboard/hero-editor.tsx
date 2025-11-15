"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Plus, X, Save, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast-provider";
import NextImage from "next/image";
import { uploadImageToS3 } from "@/lib/image-upload";

interface HeroFeature {
  id: string;
  icon: string; // Icon name (Shield, Lock, Zap)
  text: string;
}

interface HeroConfig {
  badgeText: string;
  typeWriterPhrases: string[];
  heading: string;
  headingHighlight: string; // The part that gets highlighted (e.g., "SKYBER")
  description: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
  heroImageUrl: string;
  features: HeroFeature[];
  trustPilotUrl: string;
  trustPilotText: string;
  contentEnabled?: boolean;
  buttonsEnabled?: boolean;
  imageEnabled?: boolean;
  featuresEnabled?: boolean;
  trustPilotEnabled?: boolean;
}

interface HeroEditorProps {
  onConfigChange?: (config: HeroConfig) => void;
}

export function HeroEditor({ onConfigChange }: HeroEditorProps = {}) {
  const [config, setConfig] = useState<HeroConfig>({
    badgeText: "New",
    typeWriterPhrases: [
      "Enhanced AI Security Features",
      "Smart Cybersecurity & Tech",
      "Secure Digital Experiences",
      "Innovative Security Solutions",
      "Secure, Develop, Design"
    ],
    heading: "Secure Your Digital Future With",
    headingHighlight: "SKYBER",
    description: "Leading cybersecurity solutions and exceptional web development to protect your business and accelerate your online growth.",
    primaryButtonText: "Get Started",
    secondaryButtonText: "About Us",
    secondaryButtonHref: "/about",
    heroImageUrl: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
    features: [
      { id: "1", icon: "Shield", text: "99.9% Uptime" },
      { id: "2", icon: "Lock", text: "SOC 2 Certified" },
      { id: "3", icon: "Zap", text: "24/7 Support" }
    ],
    trustPilotUrl: "https://www.trustpilot.com/review/skyber.dev",
    trustPilotText: "Review us on Trustpilot",
    contentEnabled: true,
    buttonsEnabled: true,
    imageEnabled: true,
    featuresEnabled: true,
    trustPilotEnabled: true
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [newPhrase, setNewPhrase] = useState("");
  const [newFeature, setNewFeature] = useState({ icon: "Shield", text: "" });
  const { showSuccess, showError } = useToast();
  
  // Collapsible section states (all collapsed by default)
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isButtonsOpen, setIsButtonsOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isTrustPilotOpen, setIsTrustPilotOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to S3
      const result = await uploadImageToS3({
        category: 'edit-page',
        subcategory: 'hero',
        imageKey: 'hero-image',
        file
      });

      if (result.success && result.url) {
        setConfig({ ...config, heroImageUrl: result.url });
        setImagePreview(result.url);
        showSuccess('Success', 'Hero image uploaded to S3 successfully');
      } else {
        showError('Upload Failed', result.error || 'Failed to upload image');
      }
    } catch (error: any) {
      showError('Upload Failed', error.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddPhrase = () => {
    if (newPhrase.trim()) {
      setConfig({
        ...config,
        typeWriterPhrases: [...config.typeWriterPhrases, newPhrase.trim()]
      });
      setNewPhrase("");
    }
  };

  const handleRemovePhrase = (index: number) => {
    setConfig({
      ...config,
      typeWriterPhrases: config.typeWriterPhrases.filter((_, i) => i !== index)
    });
  };

  const handleAddFeature = () => {
    if (newFeature.text.trim()) {
      const newFeatureItem: HeroFeature = {
        id: Date.now().toString(),
        icon: newFeature.icon,
        text: newFeature.text.trim()
      };
      setConfig({
        ...config,
        features: [...config.features, newFeatureItem]
      });
      setNewFeature({ icon: "Shield", text: "" });
    }
  };

  const handleRemoveFeature = (id: string) => {
    setConfig({
      ...config,
      features: config.features.filter((f) => f.id !== id)
    });
  };

  const handleUpdateFeature = (id: string, field: "icon" | "text", value: string) => {
    setConfig({
      ...config,
      features: config.features.map((f) =>
        f.id === id ? { ...f, [field]: value } : f
      )
    });
  };

  // Load current config on mount
  useEffect(() => {
    loadCurrentConfig();
  }, []);

  const loadCurrentConfig = async () => {
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      if (!sessionToken) return;

      const response = await fetch(`${API_URL}/api/site-config/current`, {
        headers: { 'Authorization': `Bearer ${sessionToken}` },
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (data.success && data.data.hero) {
            const loadedConfig = data.data.hero;
            setConfig(loadedConfig);
            if (loadedConfig.heroImageUrl) {
              setImagePreview(loadedConfig.heroImageUrl);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading hero config:', error);
    }
  };

  // Notify parent of config changes
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange(config);
    }
  }, [config, onConfigChange]);

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
        body: JSON.stringify({ hero: config }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        showError('Save Failed', 'Server returned invalid response. Please check if the backend is running.');
        return;
      }

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccess('Saved Successfully', 'Hero section configuration saved and backup created');
        // Trigger hero refresh by dispatching custom event
        window.dispatchEvent(new Event('heroConfigUpdated'));
        await loadCurrentConfig();
      } else {
        showError('Save Failed', data?.error || 'Failed to save configuration. Make sure the backend server is running.');
      }
    } catch (error: any) {
      console.error("Error saving hero config:", error);
      if (error.message === 'Failed to fetch') {
        showError('Connection Error', 'Cannot connect to the backend server. Please ensure it is running on port 3001.');
      } else {
        showError('Save Failed', 'An error occurred while saving');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const iconOptions = ["Shield", "Lock", "Zap", "Star", "Check", "Award", "Globe", "Heart"];

  return (
    <div className="space-y-6">
      {/* Main Content */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setIsContentOpen(!isContentOpen)}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Hero Content</CardTitle>
              <CardDescription>Edit the main hero section text and content</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className={cn(
                  "h-8 w-8",
                  config.contentEnabled !== false ? "text-green-600" : "text-gray-400"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfig({ ...config, contentEnabled: !(config.contentEnabled !== false) });
                }}
              >
                {config.contentEnabled !== false ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsContentOpen(!isContentOpen);
                }}
              >
                {isContentOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        {config.contentEnabled !== false && (
          <div 
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isContentOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="badge-text">Badge Text</Label>
              <Input
                id="badge-text"
                value={config.badgeText}
                onChange={(e) => setConfig({ ...config, badgeText: e.target.value })}
                placeholder="New"
              />
            </div>

            <div className="space-y-2">
              <Label>TypeWriter Phrases</Label>
              <div className="space-y-2">
                {config.typeWriterPhrases.map((phrase, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={phrase}
                      onChange={(e) => {
                        const newPhrases = [...config.typeWriterPhrases];
                        newPhrases[index] = e.target.value;
                        setConfig({ ...config, typeWriterPhrases: newPhrases });
                      }}
                      placeholder="Enter phrase"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePhrase(index)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    value={newPhrase}
                    onChange={(e) => setNewPhrase(e.target.value)}
                    placeholder="Add new phrase"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddPhrase()}
                  />
                  <Button variant="outline" size="icon" onClick={handleAddPhrase}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="heading">Main Heading</Label>
              <Input
                id="heading"
                value={config.heading}
                onChange={(e) => setConfig({ ...config, heading: e.target.value })}
                placeholder="Secure Your Digital Future With"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="heading-highlight">Heading Highlight Text</Label>
              <Input
                id="heading-highlight"
                value={config.headingHighlight}
                onChange={(e) => setConfig({ ...config, headingHighlight: e.target.value })}
                placeholder="SKYBER"
              />
              <p className="text-xs text-muted-foreground">This text will be highlighted in the heading</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                placeholder="Enter description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={3}
              />
            </div>
          </CardContent>
        </div>
        )}
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setIsButtonsOpen(!isButtonsOpen)}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Action Buttons</CardTitle>
              <CardDescription>Configure the primary and secondary buttons</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className={cn(
                  "h-8 w-8",
                  config.buttonsEnabled !== false ? "text-green-600" : "text-gray-400"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfig({ ...config, buttonsEnabled: !(config.buttonsEnabled !== false) });
                }}
              >
                {config.buttonsEnabled !== false ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsButtonsOpen(!isButtonsOpen);
                }}
              >
                {isButtonsOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        {config.buttonsEnabled !== false && (
          <div 
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isButtonsOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primary-button">Primary Button Text</Label>
              <Input
                id="primary-button"
                value={config.primaryButtonText}
                onChange={(e) => setConfig({ ...config, primaryButtonText: e.target.value })}
                placeholder="Get Started"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-button-text">Secondary Button Text</Label>
              <Input
                id="secondary-button-text"
                value={config.secondaryButtonText}
                onChange={(e) => setConfig({ ...config, secondaryButtonText: e.target.value })}
                placeholder="About Us"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-button-href">Secondary Button Link</Label>
              <Input
                id="secondary-button-href"
                value={config.secondaryButtonHref}
                onChange={(e) => setConfig({ ...config, secondaryButtonHref: e.target.value })}
                placeholder="/about"
              />
            </div>
          </CardContent>
        </div>
        )}
      </Card>

      {/* Hero Image */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setIsImageOpen(!isImageOpen)}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Hero Image</CardTitle>
              <CardDescription>Upload or set the hero section image</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className={cn(
                  "h-8 w-8",
                  config.imageEnabled !== false ? "text-green-600" : "text-gray-400"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfig({ ...config, imageEnabled: !(config.imageEnabled !== false) });
                }}
              >
                {config.imageEnabled !== false ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsImageOpen(!isImageOpen);
                }}
              >
                {isImageOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        {config.imageEnabled !== false && (
          <div 
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isImageOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero-image-url">Image URL</Label>
              <Input
                id="hero-image-url"
                value={config.heroImageUrl}
                onChange={(e) => {
                  setConfig({ ...config, heroImageUrl: e.target.value });
                  setImagePreview(e.target.value);
                }}
                placeholder="https://images.pexels.com/photos/..."
              />
            </div>

            <div className="space-y-2">
              <Label>Or Upload Image</Label>
              <div className="flex items-center gap-4">
                <div className="w-48 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-secondary/50">
                  {imagePreview || config.heroImageUrl ? (
                    <NextImage
                      src={imagePreview || config.heroImageUrl}
                      alt="Hero preview"
                      width={192}
                      height={128}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm" asChild disabled={isUploadingImage}>
                    <label htmlFor="hero-image-upload" className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                    </label>
                  </Button>
                  <Input
                    id="hero-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: 1200x800px, JPG or PNG
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
        )}
      </Card>

      {/* Features */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Feature Items</CardTitle>
              <CardDescription>Manage feature items displayed in the hero</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className={cn(
                  "h-8 w-8",
                  config.featuresEnabled !== false ? "text-green-600" : "text-gray-400"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfig({ ...config, featuresEnabled: !(config.featuresEnabled !== false) });
                }}
              >
                {config.featuresEnabled !== false ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFeaturesOpen(!isFeaturesOpen);
                }}
              >
                {isFeaturesOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        {config.featuresEnabled !== false && (
          <div 
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isFeaturesOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <CardContent className="space-y-4">
            <div className="space-y-3">
              {config.features.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center gap-2 p-3 border rounded-lg bg-secondary/20"
                >
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <select
                      value={feature.icon}
                      onChange={(e) => handleUpdateFeature(feature.id, "icon", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {iconOptions.map((icon) => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                    <Input
                      value={feature.text}
                      onChange={(e) => handleUpdateFeature(feature.id, "text", e.target.value)}
                      placeholder="Feature text"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFeature(feature.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 p-3 border-2 border-dashed rounded-lg">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <select
                  value={newFeature.icon}
                  onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
                <Input
                  value={newFeature.text}
                  onChange={(e) => setNewFeature({ ...newFeature, text: e.target.value })}
                  placeholder="New feature text"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddFeature}
                disabled={!newFeature.text.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
          </div>
        )}
      </Card>

      {/* TrustPilot */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setIsTrustPilotOpen(!isTrustPilotOpen)}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>TrustPilot Link</CardTitle>
              <CardDescription>Configure the TrustPilot review link</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                className={cn(
                  "h-8 w-8",
                  config.trustPilotEnabled !== false ? "text-green-600" : "text-gray-400"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfig({ ...config, trustPilotEnabled: !(config.trustPilotEnabled !== false) });
                }}
              >
                {config.trustPilotEnabled !== false ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTrustPilotOpen(!isTrustPilotOpen);
                }}
              >
                {isTrustPilotOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        {config.trustPilotEnabled !== false && (
          <div 
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isTrustPilotOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trustpilot-url">TrustPilot URL</Label>
              <Input
                id="trustpilot-url"
                value={config.trustPilotUrl}
                onChange={(e) => setConfig({ ...config, trustPilotUrl: e.target.value })}
                placeholder="https://www.trustpilot.com/review/..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trustpilot-text">TrustPilot Link Text</Label>
              <Input
                id="trustpilot-text"
                value={config.trustPilotText}
                onChange={(e) => setConfig({ ...config, trustPilotText: e.target.value })}
                placeholder="Review us on Trustpilot"
              />
            </div>
          </CardContent>
          </div>
        )}
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#17D492] hover:bg-[#14c082] text-white"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Hero Settings"}
        </Button>
      </div>
    </div>
  );
}

