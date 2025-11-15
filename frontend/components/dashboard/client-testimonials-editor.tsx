"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, Plus, X, ChevronDown, ChevronUp, Upload } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import { Slider } from "@/components/ui/slider";
import NextImage from "next/image";
import { uploadImageToS3 } from "@/lib/image-upload";
import {
  Quote,
  Shield,
  Zap,
  Globe,
  Users,
  Lock,
  MessageSquare,
  Code,
  Award,
  Heart,
  Rocket,
  Target,
  Lightbulb,
  Star,
  Check,
  Palette,
  RefreshCw,
} from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  position: string;
  company: string;
  image: string;
}

interface Stat {
  id: string;
  label: string;
  numericValue: number;
  suffix: string;
  duration: number;
}

interface ClientTestimonialsConfig {
  // Header Section
  badgeText: string;
  badgeIcon: string;
  title: string;
  description: string;

  // Testimonials
  testimonials: Testimonial[];
  autoplayEnabled: boolean;
  autoplayInterval: number; // in milliseconds

  // Stats Section
  stats: Stat[];

  // Background Effects
  gradientOverlay1Enabled: boolean;
  gradientOverlay1Size: number;
  gradientOverlay1X: number;
  gradientOverlay1Y: number;
  gradientOverlay1Color: string;
  gradientOverlay1Opacity: number;

  gradientOverlay2Enabled: boolean;
  gradientOverlay2Size: number;
  gradientOverlay2X: number;
  gradientOverlay2Y: number;
  gradientOverlay2Color: string;
  gradientOverlay2Opacity: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Quote,
  Shield,
  Zap,
  Globe,
  Users,
  Lock,
  MessageSquare,
  Code,
  Award,
  Heart,
  Rocket,
  Target,
  Lightbulb,
  Star,
  Check,
  Palette,
  RefreshCw,
};

interface ClientTestimonialsEditorProps {
  onConfigChange?: (config: ClientTestimonialsConfig) => void;
}

export function ClientTestimonialsEditor({ onConfigChange }: ClientTestimonialsEditorProps = {}) {
  const [config, setConfig] = useState<ClientTestimonialsConfig>({
    badgeText: "What Our Clients Say",
    badgeIcon: "Quote",
    title: "Results that speak for themselves",
    description: "Teams that build with SKYBER stay with SKYBER—because we obsess over reliability, speed, and measurable outcomes.",
    testimonials: [
      {
        id: "1",
        quote: '<span className="skyber-text">SKYBER</span> transformed our cybersecurity posture. Within weeks, they patched critical vulnerabilities and delivered an observability layer that gives us complete confidence in production.',
        author: "Alexandra Chen",
        position: "CTO",
        company: "NexusFinance",
        image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
      {
        id: "2",
        quote: "Partnering with <span className=\"skyber-text\">SKYBER</span> raised our product standard overnight. Their design systems, automation, and security reviews helped us launch confidently and scale to thousands of users.",
        author: "Marcus Johnson",
        position: "Product Director",
        company: "EcoSolutions",
        image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
      {
        id: "3",
        quote: "From discovery to deployment, <span className=\"skyber-text\">SKYBER</span> felt like an extension of our own team. The custom platform they engineered slashed manual ops by 35% and unlocked entirely new revenue streams.",
        author: "Sophia Rodriguez",
        position: "Operations Lead",
        company: "MedTech Innovations",
        image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      },
    ],
    autoplayEnabled: true,
    autoplayInterval: 8000,
    stats: [
      { id: "1", label: "Client satisfaction", numericValue: 97, suffix: "%", duration: 2000 },
      { id: "2", label: "Return for new work", numericValue: 85, suffix: "%", duration: 2000 },
      { id: "3", label: "Avg. response time", numericValue: 12, suffix: "m", duration: 1500 },
      { id: "4", label: "Security incidents", numericValue: 0, suffix: "", duration: 1000 },
    ],
    gradientOverlay1Enabled: true,
    gradientOverlay1Size: 288,
    gradientOverlay1X: -80,
    gradientOverlay1Y: 40,
    gradientOverlay1Color: "#17D492",
    gradientOverlay1Opacity: 0.1,
    gradientOverlay2Enabled: true,
    gradientOverlay2Size: 384,
    gradientOverlay2X: 40,
    gradientOverlay2Y: 0,
    gradientOverlay2Color: "#0f172a",
    gradientOverlay2Opacity: 0.4,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    header: false,
    testimonials: false,
    stats: false,
    background: false,
  });
  const { showSuccess, showError } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
        if (!sessionToken) return;

        const response = await fetch(`${API_URL}/api/site-config/current`, {
          headers: { 'Authorization': `Bearer ${sessionToken}` },
          cache: 'no-store'
        });

        if (!response.ok) return;

        const data = await response.json();
        if (data.success && data.data?.clientTestimonials) {
          setConfig({ ...config, ...data.data.clientTestimonials });
        }
      } catch (error) {
        console.error('Error loading config:', error);
      }
    };

    loadConfig();
  }, [API_URL]);

  // Notify parent of config changes
  useEffect(() => {
    if (onConfigChange) {
      onConfigChange(config);
    }
  }, [config, onConfigChange]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
        body: JSON.stringify({ clientTestimonials: config }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to save' }));
        throw new Error(errorData.error || 'Failed to save configuration');
      }

      showSuccess('Success', 'Client Testimonials section configuration saved successfully');
    } catch (error: any) {
      showError('Save Failed', error.message || 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      quote: "",
      author: "",
      position: "",
      company: "",
      image: "",
    };
    setConfig(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, newTestimonial]
    }));
  };

  const removeTestimonial = (id: string) => {
    setConfig(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(t => t.id !== id)
    }));
  };

  const updateTestimonial = (id: string, field: keyof Testimonial, value: string) => {
    setConfig(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  };

  const handleImageUpload = async (testimonialId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImages(prev => ({ ...prev, [testimonialId]: true }));
    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({
          ...prev,
          testimonials: prev.testimonials.map(t =>
            t.id === testimonialId ? { ...t, image: reader.result as string } : t
          )
        }));
      };
      reader.readAsDataURL(file);

      // Upload to S3
      const result = await uploadImageToS3({
        category: 'content-pages',
        subcategory: 'testimonials',
        imageKey: `testimonial-${testimonialId}`,
        file
      });

      if (result.success && result.url) {
        setConfig(prev => ({
          ...prev,
          testimonials: prev.testimonials.map(t =>
            t.id === testimonialId ? { ...t, image: result.url! } : t
          )
        }));
        showSuccess('Success', 'Testimonial photo uploaded to S3 successfully');
      } else {
        showError('Upload Failed', result.error || 'Failed to upload image');
      }
    } catch (error: any) {
      showError('Upload Failed', error.message || 'Failed to upload image');
    } finally {
      setUploadingImages(prev => ({ ...prev, [testimonialId]: false }));
    }
  };

  const addStat = () => {
    const newStat: Stat = {
      id: Date.now().toString(),
      label: "",
      numericValue: 0,
      suffix: "",
      duration: 2000,
    };
    setConfig(prev => ({
      ...prev,
      stats: [...prev.stats, newStat]
    }));
  };

  const removeStat = (id: string) => {
    setConfig(prev => ({
      ...prev,
      stats: prev.stats.filter(s => s.id !== id)
    }));
  };

  const updateStat = (id: string, field: keyof Stat, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      stats: prev.stats.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h3 className="text-xl font-semibold">Edit What Our Clients Say Section</h3>
          <p className="text-muted-foreground text-sm">
            Customize the Client Testimonials section with all its elements
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} size="lg" className="shrink-0">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Header Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('header')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Header Section</CardTitle>
              <CardDescription>Edit badge, title, and description</CardDescription>
            </div>
            {expandedSections.header ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.header && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Badge Text</Label>
                <Input
                  value={config.badgeText}
                  onChange={(e) => setConfig(prev => ({ ...prev, badgeText: e.target.value }))}
                  placeholder="What Our Clients Say"
                />
              </div>
              <div className="space-y-2">
                <Label>Badge Icon</Label>
                <select
                  value={config.badgeIcon}
                  onChange={(e) => setConfig(prev => ({ ...prev, badgeIcon: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {Object.keys(iconMap).map(iconName => (
                    <option key={iconName} value={iconName}>{iconName}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={config.title}
                onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Results that speak for themselves"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={config.description}
                onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Teams that build with SKYBER stay with SKYBER..."
                rows={3}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Testimonials Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('testimonials')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Testimonials</CardTitle>
              <CardDescription>Edit testimonials with quotes, authors, and photos</CardDescription>
            </div>
            {expandedSections.testimonials ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.testimonials && (
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Label>Testimonials</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoplayEnabled"
                    checked={config.autoplayEnabled}
                    onChange={(e) => setConfig(prev => ({ ...prev, autoplayEnabled: e.target.checked }))}
                    className="rounded"
                  />
                  <Label htmlFor="autoplayEnabled">Autoplay Enabled</Label>
                </div>
                {config.autoplayEnabled && (
                  <div className="flex items-center gap-2">
                    <Label>Interval: {config.autoplayInterval}ms</Label>
                    <Slider
                      value={[config.autoplayInterval]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, autoplayInterval: value[0] }))}
                      min={3000}
                      max={15000}
                      step={1000}
                      className="w-32"
                    />
                  </div>
                )}
                <Button onClick={addTestimonial} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Testimonial
                </Button>
              </div>
            </div>
            {config.testimonials.map((testimonial, index) => (
              <Card key={testimonial.id} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold">Testimonial {index + 1}</h4>
                    <Button
                      onClick={() => removeTestimonial(testimonial.id)}
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Quote (HTML allowed, use &lt;span className="skyber-text"&gt;SKYBER&lt;/span&gt; for highlighting)</Label>
                      <Textarea
                        value={testimonial.quote}
                        onChange={(e) => updateTestimonial(testimonial.id, 'quote', e.target.value)}
                        placeholder='<span className="skyber-text">SKYBER</span> transformed our cybersecurity posture...'
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Author Name</Label>
                        <Input
                          value={testimonial.author}
                          onChange={(e) => updateTestimonial(testimonial.id, 'author', e.target.value)}
                          placeholder="Alexandra Chen"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Position</Label>
                        <Input
                          value={testimonial.position}
                          onChange={(e) => updateTestimonial(testimonial.id, 'position', e.target.value)}
                          placeholder="CTO"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input
                          value={testimonial.company}
                          onChange={(e) => updateTestimonial(testimonial.id, 'company', e.target.value)}
                          placeholder="NexusFinance"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Photo</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border">
                          <NextImage
                            src={testimonial.image}
                            alt={testimonial.author}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            type="text"
                            value={testimonial.image}
                            onChange={(e) => updateTestimonial(testimonial.id, 'image', e.target.value)}
                            placeholder="https://images.pexels.com/photos/..."
                            className="mb-2"
                          />
                          <Label htmlFor={`upload-${testimonial.id}`} className="cursor-pointer">
                            <Button type="button" size="sm" variant="outline" asChild disabled={uploadingImages[testimonial.id]}>
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                {uploadingImages[testimonial.id] ? 'Uploading...' : 'Upload Image'}
                              </span>
                            </Button>
                            <input
                              id={`upload-${testimonial.id}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(testimonial.id, e)}
                              disabled={uploadingImages[testimonial.id]}
                            />
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Stats Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('stats')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Statistics Section</CardTitle>
              <CardDescription>Edit statistics with labels, values, and animation duration</CardDescription>
            </div>
            {expandedSections.stats ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.stats && (
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Statistics</Label>
              <Button onClick={addStat} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Stat
              </Button>
            </div>
            {config.stats.map((stat, index) => (
              <Card key={stat.id} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold">Stat {index + 1}</h4>
                    <Button
                      onClick={() => removeStat(stat.id)}
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input
                        value={stat.label}
                        onChange={(e) => updateStat(stat.id, 'label', e.target.value)}
                        placeholder="Client satisfaction"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Numeric Value</Label>
                      <Input
                        type="number"
                        value={stat.numericValue}
                        onChange={(e) => updateStat(stat.id, 'numericValue', parseInt(e.target.value) || 0)}
                        placeholder="97"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Suffix</Label>
                      <Input
                        value={stat.suffix}
                        onChange={(e) => updateStat(stat.id, 'suffix', e.target.value)}
                        placeholder="%"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Animation Duration: {stat.duration}ms</Label>
                      <Slider
                        value={[stat.duration]}
                        onValueChange={(value) => updateStat(stat.id, 'duration', value[0])}
                        min={500}
                        max={5000}
                        step={100}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Background Effects */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('background')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Background Effects</CardTitle>
              <CardDescription>Edit gradient overlay effects</CardDescription>
            </div>
            {expandedSections.background ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.background && (
          <CardContent className="space-y-6">
            {/* Gradient Overlay 1 */}
            <div className="space-y-4">
              <h4 className="font-semibold">Gradient Overlay 1 (Top Left)</h4>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="gradientOverlay1Enabled"
                  checked={config.gradientOverlay1Enabled}
                  onChange={(e) => setConfig(prev => ({ ...prev, gradientOverlay1Enabled: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="gradientOverlay1Enabled">Enabled</Label>
              </div>
              {config.gradientOverlay1Enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Size: {config.gradientOverlay1Size}px</Label>
                    <Slider
                      value={[config.gradientOverlay1Size]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, gradientOverlay1Size: value[0] }))}
                      min={100}
                      max={600}
                      step={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>X Position: {config.gradientOverlay1X}px</Label>
                    <Slider
                      value={[config.gradientOverlay1X]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, gradientOverlay1X: value[0] }))}
                      min={-200}
                      max={200}
                      step={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Y Position: {config.gradientOverlay1Y}px</Label>
                    <Slider
                      value={[config.gradientOverlay1Y]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, gradientOverlay1Y: value[0] }))}
                      min={-200}
                      max={200}
                      step={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input
                      type="color"
                      value={config.gradientOverlay1Color}
                      onChange={(e) => setConfig(prev => ({ ...prev, gradientOverlay1Color: e.target.value }))}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Opacity: {config.gradientOverlay1Opacity}</Label>
                    <Slider
                      value={[config.gradientOverlay1Opacity]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, gradientOverlay1Opacity: value[0] }))}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Gradient Overlay 2 */}
            <div className="space-y-4">
              <h4 className="font-semibold">Gradient Overlay 2 (Bottom Right)</h4>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="gradientOverlay2Enabled"
                  checked={config.gradientOverlay2Enabled}
                  onChange={(e) => setConfig(prev => ({ ...prev, gradientOverlay2Enabled: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="gradientOverlay2Enabled">Enabled</Label>
              </div>
              {config.gradientOverlay2Enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Size: {config.gradientOverlay2Size}px</Label>
                    <Slider
                      value={[config.gradientOverlay2Size]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, gradientOverlay2Size: value[0] }))}
                      min={100}
                      max={600}
                      step={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>X Position: {config.gradientOverlay2X}px</Label>
                    <Slider
                      value={[config.gradientOverlay2X]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, gradientOverlay2X: value[0] }))}
                      min={-200}
                      max={200}
                      step={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Y Position: {config.gradientOverlay2Y}px</Label>
                    <Slider
                      value={[config.gradientOverlay2Y]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, gradientOverlay2Y: value[0] }))}
                      min={-200}
                      max={200}
                      step={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input
                      type="color"
                      value={config.gradientOverlay2Color}
                      onChange={(e) => setConfig(prev => ({ ...prev, gradientOverlay2Color: e.target.value }))}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Opacity: {config.gradientOverlay2Opacity}</Label>
                    <Slider
                      value={[config.gradientOverlay2Opacity]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, gradientOverlay2Opacity: value[0] }))}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

