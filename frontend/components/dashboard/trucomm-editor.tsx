"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Shield,
  Zap,
  Globe,
  Users,
  Lock,
  Code,
  Award,
  Heart,
  Rocket,
  Target,
  Lightbulb,
  Star,
  Check,
  Palette,
} from "lucide-react";

interface FeatureCard {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface FloatingCard {
  id: string;
  icon: string;
  badge: string;
  title: string;
  description: string;
}

interface TruCommConfig {
  // Header Section
  badgeText: string;
  badgeIcon: string;
  title: string;
  titleHighlight: string;
  description: string;
  descriptionHighlight: string;
  descriptionSuffix: string;

  // Main Content
  subtitle: string;
  subtitleHighlight: string;
  subtitleSuffix: string;
  subtitleText: string;

  // Feature Cards (small cards)
  features: FeatureCard[];

  // CTA Button
  ctaButtonText: string;
  ctaButtonIcon: string;
  noCardRequiredText: string;

  // Floating Cards
  floatingCards: FloatingCard[];

  // Floating Cards Settings
  cardWidth: number;
  cardHeight: number;
  cardDistance: number;
  verticalDistance: number;
  delay: number;
  pauseOnHover: boolean;
  skewAmount: number;

  // Background Effects
  backgroundColor: string;
  auroraColor1: string;
  auroraColor2: string;
  auroraColor3: string;
  auroraAmplitude: number;
  auroraBlend: number;
  auroraSpeed: number;
  auroraOpacity: number;

  // Floating Background Effects
  floatingEffect1Enabled: boolean;
  floatingEffect1Size: number;
  floatingEffect1X: number;
  floatingEffect1Y: number;
  floatingEffect1Duration: number;
  floatingEffect1Opacity: number;

  floatingEffect2Enabled: boolean;
  floatingEffect2Size: number;
  floatingEffect2X: number;
  floatingEffect2Y: number;
  floatingEffect2Duration: number;
  floatingEffect2Opacity: number;
  floatingEffect2Delay: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  Shield,
  Zap,
  Globe,
  Users,
  Lock,
  Code,
  Award,
  Heart,
  Rocket,
  Target,
  Lightbulb,
  Star,
  Check,
  Palette,
};

interface TruCommEditorProps {
  onConfigChange?: (config: TruCommConfig) => void;
}

export function TruCommEditor({ onConfigChange }: TruCommEditorProps = {}) {
  const [config, setConfig] = useState<TruCommConfig>({
    badgeText: "Featured Software",
    badgeIcon: "MessageSquare",
    title: "Outstanding Software by",
    titleHighlight: "Skyber",
    description: "Introducing",
    descriptionHighlight: "TruComm",
    descriptionSuffix: "- Revolutionary communication platform designed for modern teams",
    subtitle: "MEET",
    subtitleHighlight: "TRU",
    subtitleSuffix: "COMM",
    subtitleText: "Experience the future of team collaboration with TruComm. Built with enterprise-grade security and cutting-edge technology to keep your team connected and productive.",
    features: [
      { id: "1", icon: "Shield", title: "Enterprise Security", description: "End-to-end encryption" },
      { id: "2", icon: "Zap", title: "Lightning Fast", description: "Real-time messaging" },
      { id: "3", icon: "Globe", title: "Global Reach", description: "Works anywhere" },
      { id: "4", icon: "Users", title: "Team Collaboration", description: "Seamless teamwork" },
      { id: "5", icon: "Lock", title: "Privacy First", description: "Your data, your control" },
      { id: "6", icon: "MessageSquare", title: "Smart Features", description: "AI-powered insights" },
    ],
    ctaButtonText: "GET STARTED",
    ctaButtonIcon: "Crown",
    noCardRequiredText: "(No Card Required)",
    floatingCards: [
      {
        id: "1",
        icon: "Shield",
        badge: "Security",
        title: "Enterprise-Grade Protection",
        description: "End-to-end encryption ensures your conversations remain private and secure.",
      },
      {
        id: "2",
        icon: "Zap",
        badge: "Performance",
        title: "Lightning-Fast Messaging",
        description: "Real-time communication with zero latency. Stay connected instantly.",
      },
      {
        id: "3",
        icon: "Users",
        badge: "Collaboration",
        title: "Team Collaboration",
        description: "Seamless teamwork with channels, threads, and integrated workflows.",
      },
      {
        id: "4",
        icon: "Globe",
        badge: "Global",
        title: "Works Everywhere",
        description: "Access TruComm from any device, anywhere in the world. Cloud-powered and reliable.",
      },
    ],
    cardWidth: 420,
    cardHeight: 336,
    cardDistance: 50,
    verticalDistance: 59,
    delay: 5000,
    pauseOnHover: true,
    skewAmount: 6,
    backgroundColor: "#09090B",
    auroraColor1: "#09090B",
    auroraColor2: "#E94560",
    auroraColor3: "#09090B",
    auroraAmplitude: 1.5,
    auroraBlend: 0.8,
    auroraSpeed: 1.0,
    auroraOpacity: 0.7,
    floatingEffect1Enabled: true,
    floatingEffect1Size: 288,
    floatingEffect1X: 10,
    floatingEffect1Y: 20,
    floatingEffect1Duration: 8,
    floatingEffect1Opacity: 0.3,
    floatingEffect2Enabled: true,
    floatingEffect2Size: 384,
    floatingEffect2X: 10,
    floatingEffect2Y: 20,
    floatingEffect2Duration: 10,
    floatingEffect2Opacity: 0.2,
    floatingEffect2Delay: 2,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    header: false,
    content: false,
    features: false,
    cta: false,
    floatingCards: false,
    cardSettings: false,
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
        if (data.success && data.data?.trucomm) {
          setConfig(data.data.trucomm);
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
        body: JSON.stringify({ trucomm: config }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to save' }));
        throw new Error(errorData.error || 'Failed to save configuration');
      }

      showSuccess('Success', 'TruComm section configuration saved successfully');
    } catch (error: any) {
      showError('Save Failed', error.message || 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const addFeature = () => {
    const newFeature: FeatureCard = {
      id: Date.now().toString(),
      icon: "Shield",
      title: "",
      description: ""
    };
    setConfig(prev => ({
      ...prev,
      features: [...prev.features, newFeature]
    }));
  };

  const removeFeature = (id: string) => {
    setConfig(prev => ({
      ...prev,
      features: prev.features.filter(f => f.id !== id)
    }));
  };

  const updateFeature = (id: string, field: keyof FeatureCard, value: string) => {
    setConfig(prev => ({
      ...prev,
      features: prev.features.map(f => f.id === id ? { ...f, [field]: value } : f)
    }));
  };

  const addFloatingCard = () => {
    const newCard: FloatingCard = {
      id: Date.now().toString(),
      icon: "Shield",
      badge: "",
      title: "",
      description: ""
    };
    setConfig(prev => ({
      ...prev,
      floatingCards: [...prev.floatingCards, newCard]
    }));
  };

  const removeFloatingCard = (id: string) => {
    setConfig(prev => ({
      ...prev,
      floatingCards: prev.floatingCards.filter(c => c.id !== id)
    }));
  };

  const updateFloatingCard = (id: string, field: keyof FloatingCard, value: string) => {
    setConfig(prev => ({
      ...prev,
      floatingCards: prev.floatingCards.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h3 className="text-xl font-semibold">Edit Featured Software Section</h3>
          <p className="text-muted-foreground text-sm">
            Customize the TruComm section with all its elements
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
                  placeholder="Featured Software"
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
                placeholder="Outstanding Software by"
              />
            </div>
            <div className="space-y-2">
              <Label>Title Highlight (Skyber)</Label>
              <Input
                value={config.titleHighlight}
                onChange={(e) => setConfig(prev => ({ ...prev, titleHighlight: e.target.value }))}
                placeholder="Skyber"
              />
            </div>
            <div className="space-y-2">
              <Label>Description Prefix</Label>
              <Input
                value={config.description}
                onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Introducing"
              />
            </div>
            <div className="space-y-2">
              <Label>Description Highlight (TruComm)</Label>
              <Input
                value={config.descriptionHighlight}
                onChange={(e) => setConfig(prev => ({ ...prev, descriptionHighlight: e.target.value }))}
                placeholder="TruComm"
              />
            </div>
            <div className="space-y-2">
              <Label>Description Suffix</Label>
              <Textarea
                value={config.descriptionSuffix}
                onChange={(e) => setConfig(prev => ({ ...prev, descriptionSuffix: e.target.value }))}
                placeholder="- Revolutionary communication platform designed for modern teams"
                rows={2}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Content Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('content')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Main Content</CardTitle>
              <CardDescription>Edit subtitle and description</CardDescription>
            </div>
            {expandedSections.content ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.content && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Subtitle (MEET)</Label>
                <Input
                  value={config.subtitle}
                  onChange={(e) => setConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="MEET"
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle Highlight (TRU)</Label>
                <Input
                  value={config.subtitleHighlight}
                  onChange={(e) => setConfig(prev => ({ ...prev, subtitleHighlight: e.target.value }))}
                  placeholder="TRU"
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle Suffix (COMM)</Label>
                <Input
                  value={config.subtitleSuffix}
                  onChange={(e) => setConfig(prev => ({ ...prev, subtitleSuffix: e.target.value }))}
                  placeholder="COMM"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Subtitle Description</Label>
              <Textarea
                value={config.subtitleText}
                onChange={(e) => setConfig(prev => ({ ...prev, subtitleText: e.target.value }))}
                placeholder="Experience the future of team collaboration..."
                rows={3}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Features Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('features')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Feature Cards</CardTitle>
              <CardDescription>Edit small feature cards with icons</CardDescription>
            </div>
            {expandedSections.features ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.features && (
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Features</Label>
              <Button onClick={addFeature} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>
            {config.features.map((feature, index) => (
              <Card key={feature.id} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold">Feature {index + 1}</h4>
                    <Button
                      onClick={() => removeFeature(feature.id)}
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
                        value={feature.icon}
                        onChange={(e) => updateFeature(feature.id, 'icon', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {Object.keys(iconMap).map(iconName => (
                          <option key={iconName} value={iconName}>{iconName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={feature.title}
                        onChange={(e) => updateFeature(feature.id, 'title', e.target.value)}
                        placeholder="Enterprise Security"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        value={feature.description}
                        onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                        placeholder="End-to-end encryption"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        )}
      </Card>

      {/* CTA Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('cta')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Call-to-Action Button</CardTitle>
              <CardDescription>Edit button text, icon, and subtext</CardDescription>
            </div>
            {expandedSections.cta ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.cta && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={config.ctaButtonText}
                  onChange={(e) => setConfig(prev => ({ ...prev, ctaButtonText: e.target.value }))}
                  placeholder="GET STARTED"
                />
              </div>
              <div className="space-y-2">
                <Label>Button Icon</Label>
                <Input
                  value={config.ctaButtonIcon}
                  onChange={(e) => setConfig(prev => ({ ...prev, ctaButtonIcon: e.target.value }))}
                  placeholder="Crown"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>No Card Required Text</Label>
              <Input
                value={config.noCardRequiredText}
                onChange={(e) => setConfig(prev => ({ ...prev, noCardRequiredText: e.target.value }))}
                placeholder="(No Card Required)"
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Floating Cards Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('floatingCards')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Floating Cards</CardTitle>
              <CardDescription>Edit floating card content</CardDescription>
            </div>
            {expandedSections.floatingCards ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.floatingCards && (
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Floating Cards</Label>
              <Button onClick={addFloatingCard} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </div>
            {config.floatingCards.map((card, index) => (
              <Card key={card.id} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold">Card {index + 1}</h4>
                    <Button
                      onClick={() => removeFloatingCard(card.id)}
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <select
                        value={card.icon}
                        onChange={(e) => updateFloatingCard(card.id, 'icon', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {Object.keys(iconMap).map(iconName => (
                          <option key={iconName} value={iconName}>{iconName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Badge</Label>
                      <Input
                        value={card.badge}
                        onChange={(e) => updateFloatingCard(card.id, 'badge', e.target.value)}
                        placeholder="Security"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={card.title}
                        onChange={(e) => updateFloatingCard(card.id, 'title', e.target.value)}
                        placeholder="Enterprise-Grade Protection"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={card.description}
                        onChange={(e) => updateFloatingCard(card.id, 'description', e.target.value)}
                        placeholder="End-to-end encryption ensures..."
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Card Settings Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('cardSettings')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Floating Cards Settings</CardTitle>
              <CardDescription>Edit card size, position, and animation</CardDescription>
            </div>
            {expandedSections.cardSettings ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.cardSettings && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Card Width: {config.cardWidth}px</Label>
                <Slider
                  value={[config.cardWidth]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, cardWidth: value[0] }))}
                  min={200}
                  max={600}
                  step={10}
                />
              </div>
              <div className="space-y-2">
                <Label>Card Height: {config.cardHeight}px</Label>
                <Slider
                  value={[config.cardHeight]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, cardHeight: value[0] }))}
                  min={200}
                  max={500}
                  step={10}
                />
              </div>
              <div className="space-y-2">
                <Label>Card Distance: {config.cardDistance}px</Label>
                <Slider
                  value={[config.cardDistance]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, cardDistance: value[0] }))}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Vertical Distance: {config.verticalDistance}px</Label>
                <Slider
                  value={[config.verticalDistance]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, verticalDistance: value[0] }))}
                  min={0}
                  max={100}
                  step={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Animation Delay: {config.delay}ms</Label>
                <Slider
                  value={[config.delay]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, delay: value[0] }))}
                  min={1000}
                  max={10000}
                  step={500}
                />
              </div>
              <div className="space-y-2">
                <Label>Skew Amount: {config.skewAmount}°</Label>
                <Slider
                  value={[config.skewAmount]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, skewAmount: value[0] }))}
                  min={0}
                  max={20}
                  step={1}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="pauseOnHover"
                checked={config.pauseOnHover}
                onChange={(e) => setConfig(prev => ({ ...prev, pauseOnHover: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="pauseOnHover">Pause on Hover</Label>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Background Effects Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('background')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Background Effects</CardTitle>
              <CardDescription>Edit Aurora effect and floating effects</CardDescription>
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
            <div className="space-y-4">
              <h4 className="font-semibold">Background Color</h4>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <Input
                  type="color"
                  value={config.backgroundColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Aurora Effect</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Color 1</Label>
                  <Input
                    type="color"
                    value={config.auroraColor1}
                    onChange={(e) => setConfig(prev => ({ ...prev, auroraColor1: e.target.value }))}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color 2</Label>
                  <Input
                    type="color"
                    value={config.auroraColor2}
                    onChange={(e) => setConfig(prev => ({ ...prev, auroraColor2: e.target.value }))}
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Color 3</Label>
                  <Input
                    type="color"
                    value={config.auroraColor3}
                    onChange={(e) => setConfig(prev => ({ ...prev, auroraColor3: e.target.value }))}
                    className="h-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Amplitude: {config.auroraAmplitude}</Label>
                  <Slider
                    value={[config.auroraAmplitude]}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, auroraAmplitude: value[0] }))}
                    min={0}
                    max={3}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Blend: {config.auroraBlend}</Label>
                  <Slider
                    value={[config.auroraBlend]}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, auroraBlend: value[0] }))}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Speed: {config.auroraSpeed}</Label>
                  <Slider
                    value={[config.auroraSpeed]}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, auroraSpeed: value[0] }))}
                    min={0}
                    max={3}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Opacity: {config.auroraOpacity}</Label>
                  <Slider
                    value={[config.auroraOpacity]}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, auroraOpacity: value[0] }))}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Floating Effect 1</h4>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="floatingEffect1Enabled"
                  checked={config.floatingEffect1Enabled}
                  onChange={(e) => setConfig(prev => ({ ...prev, floatingEffect1Enabled: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="floatingEffect1Enabled">Enabled</Label>
              </div>
              {config.floatingEffect1Enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Size: {config.floatingEffect1Size}px</Label>
                    <Slider
                      value={[config.floatingEffect1Size]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, floatingEffect1Size: value[0] }))}
                      min={100}
                      max={500}
                      step={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>X Position: {config.floatingEffect1X}px</Label>
                    <Slider
                      value={[config.floatingEffect1X]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, floatingEffect1X: value[0] }))}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Y Position: {config.floatingEffect1Y}px</Label>
                    <Slider
                      value={[config.floatingEffect1Y]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, floatingEffect1Y: value[0] }))}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration: {config.floatingEffect1Duration}s</Label>
                    <Slider
                      value={[config.floatingEffect1Duration]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, floatingEffect1Duration: value[0] }))}
                      min={1}
                      max={20}
                      step={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Opacity: {config.floatingEffect1Opacity}</Label>
                    <Slider
                      value={[config.floatingEffect1Opacity]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, floatingEffect1Opacity: value[0] }))}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Floating Effect 2</h4>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="floatingEffect2Enabled"
                  checked={config.floatingEffect2Enabled}
                  onChange={(e) => setConfig(prev => ({ ...prev, floatingEffect2Enabled: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="floatingEffect2Enabled">Enabled</Label>
              </div>
              {config.floatingEffect2Enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Size: {config.floatingEffect2Size}px</Label>
                    <Slider
                      value={[config.floatingEffect2Size]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, floatingEffect2Size: value[0] }))}
                      min={100}
                      max={500}
                      step={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>X Position: {config.floatingEffect2X}px</Label>
                    <Slider
                      value={[config.floatingEffect2X]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, floatingEffect2X: value[0] }))}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Y Position: {config.floatingEffect2Y}px</Label>
                    <Slider
                      value={[config.floatingEffect2Y]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, floatingEffect2Y: value[0] }))}
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duration: {config.floatingEffect2Duration}s</Label>
                    <Slider
                      value={[config.floatingEffect2Duration]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, floatingEffect2Duration: value[0] }))}
                      min={1}
                      max={20}
                      step={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Opacity: {config.floatingEffect2Opacity}</Label>
                    <Slider
                      value={[config.floatingEffect2Opacity]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, floatingEffect2Opacity: value[0] }))}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Delay: {config.floatingEffect2Delay}s</Label>
                    <Slider
                      value={[config.floatingEffect2Delay]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, floatingEffect2Delay: value[0] }))}
                      min={0}
                      max={10}
                      step={0.5}
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

