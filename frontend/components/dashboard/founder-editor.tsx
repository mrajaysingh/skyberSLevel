"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Plus, X, Save, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import NextImage from "next/image";
import { uploadImageToS3 } from "@/lib/image-upload";
import {
  Lightbulb,
  Target,
  Heart,
  Rocket,
  Code,
  Award,
  Shield,
  Users,
  Zap,
  Palette,
  Globe,
  Lock,
  Star,
  Check,
} from "lucide-react";

interface Value {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface FounderConfig {
  pageHero: {
    badgeText: string;
    title: string;
    description: string;
  };
  founder: {
    name: string;
    designation: string;
    image: string;
    aboutTitle: string;
    aboutParagraphs: string[];
  };
  values: Value[];
  bottomSection: {
    title: string;
    description: string;
    ctaText: string;
    ctaSubtext: string;
  };
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb,
  Target,
  Heart,
  Rocket,
  Code,
  Award,
  Shield,
  Users,
  Zap,
  Palette,
  Globe,
  Lock,
  Star,
  Check,
};

export function FounderEditor() {
  const [config, setConfig] = useState<FounderConfig>({
    pageHero: {
      badgeText: "Meet the Founder",
      title: "About the SKYBER Founder",
      description: "Driving innovation in cybersecurity and web development with a vision for excellence."
    },
    founder: {
      name: "Founder Name",
      designation: "CEO & Founder, SKYBER",
      image: "/Default/founder-placeholder.png",
      aboutTitle: "About the Founder",
      aboutParagraphs: [
        "At SKYBER, we believe in creating digital solutions that are not just functional, but secure, scalable, and built to last. Our founder's vision is to bridge the gap between cutting-edge technology and practical business needs.",
        "SKYBER was founded on the principle that technology should empower businesses, not complicate them. We're committed to delivering solutions that are secure, efficient, and tailored to your unique needs. Every project is an opportunity to make a meaningful impact, and we approach each one with dedication, expertise, and a genuine passion for excellence.",
        "With years of experience in cybersecurity and web development, the founder has built SKYBER into a trusted partner for businesses looking to secure their digital infrastructure and build innovative solutions that drive growth."
      ]
    },
    values: [
      {
        id: "1",
        icon: "Lightbulb",
        title: "Innovation First",
        description: "Constantly pushing boundaries and exploring new technologies to deliver cutting-edge solutions."
      },
      {
        id: "2",
        icon: "Target",
        title: "Client-Centric",
        description: "Every decision is made with our clients' success and satisfaction as the top priority."
      },
      {
        id: "3",
        icon: "Heart",
        title: "Passion-Driven",
        description: "We love what we do, and that passion translates into exceptional results for every project."
      },
      {
        id: "4",
        icon: "Rocket",
        title: "Growth Mindset",
        description: "Always learning, always improving, always evolving to stay ahead of the curve."
      }
    ],
    bottomSection: {
      title: "Building the Future, One Project at a Time",
      description: "Whether you're looking to secure your digital infrastructure, build a cutting-edge web application, or transform your business with custom software solutions, SKYBER is here to help you achieve your goals.",
      ctaText: "Ready to get started?",
      ctaSubtext: "Let's build something amazing together."
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    pageHero: false,
    founder: false,
    values: false,
    bottomSection: false
  });
  const { showSuccess, showError } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Load config on mount
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
        if (data.success && data.data?.founder) {
          setConfig(data.data.founder);
        }
      } catch (error) {
        console.error('Error loading config:', error);
      }
    };

    loadConfig();
  }, [API_URL]);

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
        body: JSON.stringify({ founder: config }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to save' }));
        throw new Error(errorData.error || 'Failed to save configuration');
      }

      showSuccess('Success', 'Founder page configuration saved successfully');
    } catch (error: any) {
      showError('Save Failed', error.message || 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({
          ...prev,
          founder: { ...prev.founder, image: reader.result as string }
        }));
      };
      reader.readAsDataURL(file);

      // Upload to S3
      const result = await uploadImageToS3({
        category: 'content-pages',
        subcategory: 'founder',
        imageKey: 'founder-photo',
        file
      });

      if (result.success && result.url) {
        setConfig(prev => ({
          ...prev,
          founder: { ...prev.founder, image: result.url! }
        }));
        showSuccess('Success', 'Founder photo uploaded to S3 successfully');
      } else {
        showError('Upload Failed', result.error || 'Failed to upload image');
      }
    } catch (error: any) {
      showError('Upload Failed', error.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const addValue = () => {
    const newValue: Value = {
      id: Date.now().toString(),
      icon: "Lightbulb",
      title: "",
      description: ""
    };
    setConfig(prev => ({
      ...prev,
      values: [...prev.values, newValue]
    }));
  };

  const removeValue = (id: string) => {
    setConfig(prev => ({
      ...prev,
      values: prev.values.filter(v => v.id !== id)
    }));
  };

  const updateValue = (id: string, field: keyof Value, value: string) => {
    setConfig(prev => ({
      ...prev,
      values: prev.values.map(v => v.id === id ? { ...v, [field]: value } : v)
    }));
  };

  const addAboutParagraph = () => {
    setConfig(prev => ({
      ...prev,
      founder: {
        ...prev.founder,
        aboutParagraphs: [...prev.founder.aboutParagraphs, ""]
      }
    }));
  };

  const updateAboutParagraph = (index: number, value: string) => {
    setConfig(prev => ({
      ...prev,
      founder: {
        ...prev.founder,
        aboutParagraphs: prev.founder.aboutParagraphs.map((p, i) => i === index ? value : p)
      }
    }));
  };

  const removeAboutParagraph = (index: number) => {
    setConfig(prev => ({
      ...prev,
      founder: {
        ...prev.founder,
        aboutParagraphs: prev.founder.aboutParagraphs.filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h3 className="text-xl font-semibold">Edit Founder Page</h3>
          <p className="text-muted-foreground text-sm">
            Customize all sections of the Founder page
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="lg"
          className="shrink-0"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Page Hero Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('pageHero')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Page Hero Section</CardTitle>
              <CardDescription>
                Edit badge text, title, and description
              </CardDescription>
            </div>
            {expandedSections.pageHero ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.pageHero && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Badge Text</Label>
              <Input
                value={config.pageHero.badgeText}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  pageHero: { ...prev.pageHero, badgeText: e.target.value }
                }))}
                placeholder="Meet the Founder"
              />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={config.pageHero.title}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  pageHero: { ...prev.pageHero, title: e.target.value }
                }))}
                placeholder="About the SKYBER Founder"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={config.pageHero.description}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  pageHero: { ...prev.pageHero, description: e.target.value }
                }))}
                placeholder="Driving innovation in cybersecurity..."
                rows={3}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Founder Info Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('founder')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Founder Information</CardTitle>
              <CardDescription>
                Edit founder name, designation, photo, and about content
              </CardDescription>
            </div>
            {expandedSections.founder ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.founder && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={config.founder.name}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    founder: { ...prev.founder, name: e.target.value }
                  }))}
                  placeholder="Founder Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input
                  value={config.founder.designation}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    founder: { ...prev.founder, designation: e.target.value }
                  }))}
                  placeholder="CEO & Founder, SKYBER"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Photo</Label>
              <div className="flex items-center gap-4">
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                  <NextImage
                    src={config.founder.image}
                    alt={config.founder.name}
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
                    value={config.founder.image}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      founder: { ...prev.founder, image: e.target.value }
                    }))}
                    placeholder="/Default/founder-placeholder.png"
                    className="mb-2"
                  />
                  <Label htmlFor="upload-founder" className="cursor-pointer">
                    <Button type="button" size="sm" variant="outline" asChild disabled={isUploadingImage}>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                      </span>
                    </Button>
                    <input
                      id="upload-founder"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                    />
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>About Section Title</Label>
              <Input
                value={config.founder.aboutTitle}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  founder: { ...prev.founder, aboutTitle: e.target.value }
                }))}
                placeholder="About the Founder"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>About Paragraphs</Label>
                <Button onClick={addAboutParagraph} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Paragraph
                </Button>
              </div>
              {config.founder.aboutParagraphs.map((paragraph, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Textarea
                    value={paragraph}
                    onChange={(e) => updateAboutParagraph(index, e.target.value)}
                    placeholder="At SKYBER, we believe in creating digital solutions..."
                    rows={4}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => removeAboutParagraph(index)}
                    size="sm"
                    variant="ghost"
                    className="text-destructive mt-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Values Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('values')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Values Section</CardTitle>
              <CardDescription>
                Edit values displayed on the founder page
              </CardDescription>
            </div>
            {expandedSections.values ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.values && (
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Values</Label>
              <Button onClick={addValue} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Value
              </Button>
            </div>

            {config.values.map((value, index) => (
              <Card key={value.id} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold">Value {index + 1}</h4>
                    <Button
                      onClick={() => removeValue(value.id)}
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <select
                        value={value.icon}
                        onChange={(e) => updateValue(value.id, 'icon', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        {Object.keys(iconMap).map(iconName => (
                          <option key={iconName} value={iconName}>{iconName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={value.title}
                        onChange={(e) => updateValue(value.id, 'title', e.target.value)}
                        placeholder="Innovation First"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={value.description}
                        onChange={(e) => updateValue(value.id, 'description', e.target.value)}
                        placeholder="Constantly pushing boundaries..."
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Bottom Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('bottomSection')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Bottom Section</CardTitle>
              <CardDescription>
                Edit the bottom call-to-action section
              </CardDescription>
            </div>
            {expandedSections.bottomSection ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.bottomSection && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={config.bottomSection.title}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  bottomSection: { ...prev.bottomSection, title: e.target.value }
                }))}
                placeholder="Building the Future, One Project at a Time"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={config.bottomSection.description}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  bottomSection: { ...prev.bottomSection, description: e.target.value }
                }))}
                placeholder="Whether you're looking to secure your digital infrastructure..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA Text</Label>
                <Input
                  value={config.bottomSection.ctaText}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    bottomSection: { ...prev.bottomSection, ctaText: e.target.value }
                  }))}
                  placeholder="Ready to get started?"
                />
              </div>
              <div className="space-y-2">
                <Label>CTA Subtext</Label>
                <Input
                  value={config.bottomSection.ctaSubtext}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    bottomSection: { ...prev.bottomSection, ctaSubtext: e.target.value }
                  }))}
                  placeholder="Let's build something amazing together."
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

