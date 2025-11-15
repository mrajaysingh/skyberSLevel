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
  ShieldCheck,
  Cpu,
  Sparkles,
  Users,
  TimerReset,
  Trophy,
  RefreshCw,
  Shield,
  Zap,
  Globe,
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
} from "lucide-react";

interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
  accent: string;
}

interface Stat {
  id: string;
  label: string;
  numericValue: number;
  suffix: string;
  duration: number;
}

interface WhyChooseUsConfig {
  // Header Section
  badgeText: string;
  badgeIcon: string;
  title: string;
  titleHighlight: string;
  description: string;

  // Benefits Cards
  benefits: Benefit[];

  // Stats Section
  stats: Stat[];

  // GridScan Background Settings
  gridScanSensitivity: number;
  gridScanLineThickness: number;
  gridScanLinesColorLight: string;
  gridScanLinesColorDark: string;
  gridScanGridScale: number;
  gridScanScanColor: string;
  gridScanScanOpacity: number;
  gridScanEnablePost: boolean;
  gridScanBloomIntensity: number;
  gridScanChromaticAberration: number;
  gridScanNoiseIntensity: number;

  // Gradient Overlays
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

  gradientOverlay3Enabled: boolean;
  gradientOverlay3Size: number;
  gradientOverlay3X: number;
  gradientOverlay3Y: number;
  gradientOverlay3Color: string;
  gradientOverlay3Opacity: number;

  // Background Overlay
  backgroundOverlayOpacity: number;
  backgroundOverlayOpacityDark: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Cpu,
  Sparkles,
  Users,
  TimerReset,
  Trophy,
  RefreshCw,
  Shield,
  Zap,
  Globe,
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
};

interface WhyChooseUsEditorProps {
  onConfigChange?: (config: WhyChooseUsConfig) => void;
}

export function WhyChooseUsEditor({ onConfigChange }: WhyChooseUsEditorProps = {}) {
  const [config, setConfig] = useState<WhyChooseUsConfig>({
    badgeText: "Why Teams Choose SKYBER",
    badgeIcon: "RefreshCw",
    title: "Build with the",
    titleHighlight: "team you can trust",
    description: "From stealth startups to enterprise ops teams, SKYBER becomes your partner in launching secure, resilient, jaw-dropping products—fast.",
    benefits: [
      {
        id: "1",
        icon: "ShieldCheck",
        title: "Security-First DNA",
        description: "Every solution is architected with zero-trust principles, hardened infrastructure, and compliance-driven workflows.",
        accent: "from-[#17D492]/40 to-transparent",
      },
      {
        id: "2",
        icon: "Cpu",
        title: "Human x AI Synergy",
        description: "We pair experienced engineers with battle-tested AI tooling to ship faster without compromising quality.",
        accent: "from-[#14c082]/40 to-transparent",
      },
      {
        id: "3",
        icon: "Sparkles",
        title: "Design That Converts",
        description: "From UX architecture to pixel-perfect interfaces, we craft experiences that feel premium and perform flawlessly.",
        accent: "from-[#63ddb3]/40 to-transparent",
      },
      {
        id: "4",
        icon: "Users",
        title: "Elite Delivery Squad",
        description: "You collaborate directly with core builders—no layers, no handoff telephone. Transparent, weekly value drops.",
        accent: "from-[#17d4c2]/40 to-transparent",
      },
      {
        id: "5",
        icon: "TimerReset",
        title: "24/7 Observability",
        description: "Real-time dashboards, automated alerts, and proactive threat hunting keep your stack healthy around the clock.",
        accent: "from-[#1ae5a0]/40 to-transparent",
      },
      {
        id: "6",
        icon: "Trophy",
        title: "Scale Without Fear",
        description: "Modular architectures, rigorous testing, and DevSecOps pipelines make evolving and scaling effortless.",
        accent: "from-[#0f172a]/60 via-transparent to-transparent",
      },
    ],
    stats: [
      { id: "1", label: "Mission-critical launches", numericValue: 120, suffix: "+", duration: 2000 },
      { id: "2", label: "Average response time", numericValue: 12, suffix: "m", duration: 1500 },
      { id: "3", label: "Client retention", numericValue: 96, suffix: "%", duration: 2000 },
      { id: "4", label: "Security incidents", numericValue: 0, suffix: "", duration: 1000 },
    ],
    gridScanSensitivity: 0.55,
    gridScanLineThickness: 1,
    gridScanLinesColorLight: "#e0d4f0",
    gridScanLinesColorDark: "#392e4e",
    gridScanGridScale: 0.1,
    gridScanScanColor: "#17D492",
    gridScanScanOpacity: 0.4,
    gridScanEnablePost: true,
    gridScanBloomIntensity: 0.6,
    gridScanChromaticAberration: 0.002,
    gridScanNoiseIntensity: 0.01,
    gradientOverlay1Enabled: true,
    gradientOverlay1Size: 384,
    gradientOverlay1X: -128,
    gradientOverlay1Y: -160,
    gradientOverlay1Color: "#17D492",
    gradientOverlay1Opacity: 0.1,
    gradientOverlay2Enabled: true,
    gradientOverlay2Size: 288,
    gradientOverlay2X: 40,
    gradientOverlay2Y: 133,
    gradientOverlay2Color: "#63ddb3",
    gradientOverlay2Opacity: 0.1,
    gradientOverlay3Enabled: true,
    gradientOverlay3Size: 600,
    gradientOverlay3X: 150,
    gradientOverlay3Y: 0,
    gradientOverlay3Color: "#0f172a",
    gradientOverlay3Opacity: 0.4,
    backgroundOverlayOpacity: 0.6,
    backgroundOverlayOpacityDark: 0.4,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    header: false,
    benefits: false,
    stats: false,
    gridScan: false,
    gradients: false,
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
        if (data.success && data.data?.whyChooseUs) {
          setConfig({ ...config, ...data.data.whyChooseUs });
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
        body: JSON.stringify({ whyChooseUs: config }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to save' }));
        throw new Error(errorData.error || 'Failed to save configuration');
      }

      showSuccess('Success', 'Why Choose Us section configuration saved successfully');
    } catch (error: any) {
      showError('Save Failed', error.message || 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const addBenefit = () => {
    const newBenefit: Benefit = {
      id: Date.now().toString(),
      icon: "ShieldCheck",
      title: "",
      description: "",
      accent: "from-[#17D492]/40 to-transparent",
    };
    setConfig(prev => ({
      ...prev,
      benefits: [...prev.benefits, newBenefit]
    }));
  };

  const removeBenefit = (id: string) => {
    setConfig(prev => ({
      ...prev,
      benefits: prev.benefits.filter(b => b.id !== id)
    }));
  };

  const updateBenefit = (id: string, field: keyof Benefit, value: string) => {
    setConfig(prev => ({
      ...prev,
      benefits: prev.benefits.map(b => b.id === id ? { ...b, [field]: value } : b)
    }));
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
          <h3 className="text-xl font-semibold">Edit Why Teams Choose SKYBER Section</h3>
          <p className="text-muted-foreground text-sm">
            Customize the Why Choose Us section with all its elements
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
                  placeholder="Why Teams Choose SKYBER"
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
                placeholder="Build with the"
              />
            </div>
            <div className="space-y-2">
              <Label>Title Highlight</Label>
              <Input
                value={config.titleHighlight}
                onChange={(e) => setConfig(prev => ({ ...prev, titleHighlight: e.target.value }))}
                placeholder="team you can trust"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={config.description}
                onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                placeholder="From stealth startups to enterprise ops teams..."
                rows={3}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Benefits Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('benefits')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Benefits Cards</CardTitle>
              <CardDescription>Edit benefit cards with icons, titles, and descriptions</CardDescription>
            </div>
            {expandedSections.benefits ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.benefits && (
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Benefits</Label>
              <Button onClick={addBenefit} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Benefit
              </Button>
            </div>
            {config.benefits.map((benefit, index) => (
              <Card key={benefit.id} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold">Benefit {index + 1}</h4>
                    <Button
                      onClick={() => removeBenefit(benefit.id)}
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
                        value={benefit.icon}
                        onChange={(e) => updateBenefit(benefit.id, 'icon', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {Object.keys(iconMap).map(iconName => (
                          <option key={iconName} value={iconName}>{iconName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Accent Color (Tailwind class)</Label>
                      <Input
                        value={benefit.accent}
                        onChange={(e) => updateBenefit(benefit.id, 'accent', e.target.value)}
                        placeholder="from-[#17D492]/40 to-transparent"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Title</Label>
                      <Input
                        value={benefit.title}
                        onChange={(e) => updateBenefit(benefit.id, 'title', e.target.value)}
                        placeholder="Security-First DNA"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Description</Label>
                      <Textarea
                        value={benefit.description}
                        onChange={(e) => updateBenefit(benefit.id, 'description', e.target.value)}
                        placeholder="Every solution is architected..."
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
                        placeholder="Mission-critical launches"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Numeric Value</Label>
                      <Input
                        type="number"
                        value={stat.numericValue}
                        onChange={(e) => updateStat(stat.id, 'numericValue', parseInt(e.target.value) || 0)}
                        placeholder="120"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Suffix</Label>
                      <Input
                        value={stat.suffix}
                        onChange={(e) => updateStat(stat.id, 'suffix', e.target.value)}
                        placeholder="+"
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

      {/* GridScan Settings */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('gridScan')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>GridScan Background Settings</CardTitle>
              <CardDescription>Edit GridScan animation and visual effects</CardDescription>
            </div>
            {expandedSections.gridScan ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.gridScan && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sensitivity: {config.gridScanSensitivity}</Label>
                <Slider
                  value={[config.gridScanSensitivity]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, gridScanSensitivity: value[0] }))}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
              <div className="space-y-2">
                <Label>Line Thickness: {config.gridScanLineThickness}</Label>
                <Slider
                  value={[config.gridScanLineThickness]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, gridScanLineThickness: value[0] }))}
                  min={0.5}
                  max={5}
                  step={0.5}
                />
              </div>
              <div className="space-y-2">
                <Label>Lines Color (Light)</Label>
                <Input
                  type="color"
                  value={config.gridScanLinesColorLight}
                  onChange={(e) => setConfig(prev => ({ ...prev, gridScanLinesColorLight: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label>Lines Color (Dark)</Label>
                <Input
                  type="color"
                  value={config.gridScanLinesColorDark}
                  onChange={(e) => setConfig(prev => ({ ...prev, gridScanLinesColorDark: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label>Grid Scale: {config.gridScanGridScale}</Label>
                <Slider
                  value={[config.gridScanGridScale]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, gridScanGridScale: value[0] }))}
                  min={0.01}
                  max={1}
                  step={0.01}
                />
              </div>
              <div className="space-y-2">
                <Label>Scan Color</Label>
                <Input
                  type="color"
                  value={config.gridScanScanColor}
                  onChange={(e) => setConfig(prev => ({ ...prev, gridScanScanColor: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label>Scan Opacity: {config.gridScanScanOpacity}</Label>
                <Slider
                  value={[config.gridScanScanOpacity]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, gridScanScanOpacity: value[0] }))}
                  min={0}
                  max={1}
                  step={0.1}
                />
              </div>
              <div className="space-y-2">
                <Label>Bloom Intensity: {config.gridScanBloomIntensity}</Label>
                <Slider
                  value={[config.gridScanBloomIntensity]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, gridScanBloomIntensity: value[0] }))}
                  min={0}
                  max={2}
                  step={0.1}
                />
              </div>
              <div className="space-y-2">
                <Label>Chromatic Aberration: {config.gridScanChromaticAberration}</Label>
                <Slider
                  value={[config.gridScanChromaticAberration]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, gridScanChromaticAberration: value[0] }))}
                  min={0}
                  max={0.01}
                  step={0.001}
                />
              </div>
              <div className="space-y-2">
                <Label>Noise Intensity: {config.gridScanNoiseIntensity}</Label>
                <Slider
                  value={[config.gridScanNoiseIntensity]}
                  onValueChange={(value) => setConfig(prev => ({ ...prev, gridScanNoiseIntensity: value[0] }))}
                  min={0}
                  max={0.1}
                  step={0.01}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="gridScanEnablePost"
                checked={config.gridScanEnablePost}
                onChange={(e) => setConfig(prev => ({ ...prev, gridScanEnablePost: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="gridScanEnablePost">Enable Post Processing</Label>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Gradient Overlays */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('gradients')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Gradient Overlays</CardTitle>
              <CardDescription>Edit gradient overlay effects and background overlay</CardDescription>
            </div>
            {expandedSections.gradients ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.gradients && (
          <CardContent className="space-y-6">
            {/* Gradient Overlay 1 */}
            <div className="space-y-4">
              <h4 className="font-semibold">Gradient Overlay 1</h4>
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
                      max={800}
                      step={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>X Position: {config.gradientOverlay1X}px</Label>
                    <Slider
                      value={[config.gradientOverlay1X]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, gradientOverlay1X: value[0] }))}
                      min={-500}
                      max={500}
                      step={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Y Position: {config.gradientOverlay1Y}px</Label>
                    <Slider
                      value={[config.gradientOverlay1Y]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, gradientOverlay1Y: value[0] }))}
                      min={-500}
                      max={500}
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
              <h4 className="font-semibold">Gradient Overlay 2</h4>
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
                      max={800}
                      step={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>X Position: {config.gradientOverlay2X}px</Label>
                    <Slider
                      value={[config.gradientOverlay2X]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, gradientOverlay2X: value[0] }))}
                      min={-500}
                      max={500}
                      step={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Y Position: {config.gradientOverlay2Y}px</Label>
                    <Slider
                      value={[config.gradientOverlay2Y]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, gradientOverlay2Y: value[0] }))}
                      min={-500}
                      max={500}
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

            {/* Gradient Overlay 3 */}
            <div className="space-y-4">
              <h4 className="font-semibold">Gradient Overlay 3</h4>
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="gradientOverlay3Enabled"
                  checked={config.gradientOverlay3Enabled}
                  onChange={(e) => setConfig(prev => ({ ...prev, gradientOverlay3Enabled: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="gradientOverlay3Enabled">Enabled</Label>
              </div>
              {config.gradientOverlay3Enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Size: {config.gradientOverlay3Size}px</Label>
                    <Slider
                      value={[config.gradientOverlay3Size]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, gradientOverlay3Size: value[0] }))}
                      min={100}
                      max={1000}
                      step={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>X Position: {config.gradientOverlay3X}px</Label>
                    <Slider
                      value={[config.gradientOverlay3X]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, gradientOverlay3X: value[0] }))}
                      min={-500}
                      max={500}
                      step={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Y Position: {config.gradientOverlay3Y}px</Label>
                    <Slider
                      value={[config.gradientOverlay3Y]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, gradientOverlay3Y: value[0] }))}
                      min={-500}
                      max={500}
                      step={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Color</Label>
                    <Input
                      type="color"
                      value={config.gradientOverlay3Color}
                      onChange={(e) => setConfig(prev => ({ ...prev, gradientOverlay3Color: e.target.value }))}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Opacity: {config.gradientOverlay3Opacity}</Label>
                    <Slider
                      value={[config.gradientOverlay3Opacity]}
                      onValueChange={(value) => setConfig(prev => ({ ...prev, gradientOverlay3Opacity: value[0] }))}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Background Overlay */}
            <div className="space-y-4">
              <h4 className="font-semibold">Background Overlay</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Opacity (Light): {config.backgroundOverlayOpacity}</Label>
                  <Slider
                    value={[config.backgroundOverlayOpacity]}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, backgroundOverlayOpacity: value[0] }))}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Opacity (Dark): {config.backgroundOverlayOpacityDark}</Label>
                  <Slider
                    value={[config.backgroundOverlayOpacityDark]}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, backgroundOverlayOpacityDark: value[0] }))}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

