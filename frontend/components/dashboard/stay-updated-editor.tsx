"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import {
  Mail,
  CheckCircle,
  Send,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface StayUpdatedConfig {
  // Header Section
  icon: string;
  title: string;
  description: string;
  privacyText: string;

  // Benefits
  benefits: Benefit[];

  // Background Effects
  backgroundSpeed: number;
  backgroundScale: number;
  backgroundColor: string;
  backgroundNoiseIntensity: number;
  backgroundRotation: number;
  glassMorphismIntensity: number;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mail,
  CheckCircle,
  Send,
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

const defaultConfig: StayUpdatedConfig = {
  icon: "Mail",
  title: "Stay Updated with SKYBER",
  description: "Get the latest cybersecurity insights, tech updates, and exclusive offers delivered directly to your inbox.",
  privacyText: "🔒 We respect your privacy. Unsubscribe anytime—no spam, ever.",
  benefits: [
    {
      id: "1",
      icon: "Mail",
      title: "Weekly Updates",
      description: "Curated cybersecurity news and guidance from the Skyber team.",
    },
    {
      id: "2",
      icon: "CheckCircle",
      title: "Exclusive Offers",
      description: "Early access to workshops, private betas, and partner pricing.",
    },
    {
      id: "3",
      icon: "Send",
      title: "Expert Tips",
      description: "Actionable insights to harden infrastructure and ship faster.",
    },
  ],
  backgroundSpeed: 5,
  backgroundScale: 1,
  backgroundColor: "#17D492",
  backgroundNoiseIntensity: 1.5,
  backgroundRotation: 0,
  glassMorphismIntensity: 40,
};

export function StayUpdatedEditor() {
  const [config, setConfig] = useState<StayUpdatedConfig>(defaultConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    header: true,
    benefits: false,
    background: false,
  });
  const { showSuccess, showError } = useToast();
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/api/site-config/current`, {
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.stayUpdated) {
          setConfig({ ...defaultConfig, ...data.data.stayUpdated });
        }
      }
    } catch (error) {
      console.error('Error loading Stay Updated config:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        showError('Authentication required');
        return;
      }

      const response = await fetch(`${API_URL}/api/site-config/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ stayUpdated: config }),
      });

      if (response.ok) {
        showSuccess('Stay Updated section saved successfully');
        window.dispatchEvent(new CustomEvent('stayUpdatedConfigUpdated'));
      } else {
        const error = await response.json();
        showError(error.error || 'Failed to save configuration');
      }
    } catch (error: any) {
      showError(error.message || 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const addBenefit = () => {
    const newBenefit: Benefit = {
      id: Date.now().toString(),
      icon: "Mail",
      title: "New Benefit",
      description: "Description here",
    };
    setConfig(prev => ({
      ...prev,
      benefits: [...prev.benefits, newBenefit],
    }));
  };

  const updateBenefit = (id: string, field: keyof Benefit, value: string) => {
    setConfig(prev => ({
      ...prev,
      benefits: prev.benefits.map(benefit =>
        benefit.id === id ? { ...benefit, [field]: value } : benefit
      ),
    }));
  };

  const removeBenefit = (id: string) => {
    setConfig(prev => ({
      ...prev,
      benefits: prev.benefits.filter(benefit => benefit.id !== id),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Stay Updated Section</h3>
          <p className="text-sm text-muted-foreground">Customize the newsletter subscription section</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Header Content */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('header')}
        >
          <div className="flex items-center justify-between">
            <CardTitle>Header Content</CardTitle>
            {expandedSections.header ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </CardHeader>
        {expandedSections.header && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select
                value={config.icon}
                onValueChange={(value) => setConfig(prev => ({ ...prev, icon: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(iconMap).map((iconName) => (
                    <SelectItem key={iconName} value={iconName}>
                      {iconName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={config.title}
                onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Stay Updated with SKYBER"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={config.description}
                onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Get the latest cybersecurity insights..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Privacy Text</Label>
              <Input
                value={config.privacyText}
                onChange={(e) => setConfig(prev => ({ ...prev, privacyText: e.target.value }))}
                placeholder="🔒 We respect your privacy..."
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Benefits */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('benefits')}
        >
          <div className="flex items-center justify-between">
            <CardTitle>Benefits Cards</CardTitle>
            {expandedSections.benefits ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </CardHeader>
        {expandedSections.benefits && (
          <CardContent className="space-y-4">
            {config.benefits.map((benefit, index) => (
              <Card key={benefit.id} className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold">Benefit {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBenefit(benefit.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select
                      value={benefit.icon}
                      onValueChange={(value) => updateBenefit(benefit.id, 'icon', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(iconMap).map((iconName) => (
                          <SelectItem key={iconName} value={iconName}>
                            {iconName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={benefit.title}
                      onChange={(e) => updateBenefit(benefit.id, 'title', e.target.value)}
                      placeholder="Weekly Updates"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={benefit.description}
                      onChange={(e) => updateBenefit(benefit.id, 'description', e.target.value)}
                      placeholder="Curated cybersecurity news..."
                      rows={2}
                    />
                  </div>
                </div>
              </Card>
            ))}
            <Button variant="outline" onClick={addBenefit}>
              <Plus className="h-4 w-4 mr-2" />
              Add Benefit
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Background Effects */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => toggleSection('background')}
        >
          <div className="flex items-center justify-between">
            <CardTitle>Background Effects</CardTitle>
            {expandedSections.background ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </CardHeader>
        {expandedSections.background && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Background Speed: {config.backgroundSpeed}</Label>
              <input
                type="range"
                min="1"
                max="10"
                value={config.backgroundSpeed}
                onChange={(e) => setConfig(prev => ({ ...prev, backgroundSpeed: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Background Scale: {config.backgroundScale}</Label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={config.backgroundScale}
                onChange={(e) => setConfig(prev => ({ ...prev, backgroundScale: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Background Color</Label>
              <Input
                type="color"
                value={config.backgroundColor}
                onChange={(e) => setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Noise Intensity: {config.backgroundNoiseIntensity}</Label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={config.backgroundNoiseIntensity}
                onChange={(e) => setConfig(prev => ({ ...prev, backgroundNoiseIntensity: parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Rotation: {config.backgroundRotation}°</Label>
              <input
                type="range"
                min="0"
                max="360"
                value={config.backgroundRotation}
                onChange={(e) => setConfig(prev => ({ ...prev, backgroundRotation: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Glass Morphism Intensity: {config.glassMorphismIntensity}%</Label>
              <input
                type="range"
                min="0"
                max="100"
                value={config.glassMorphismIntensity}
                onChange={(e) => setConfig(prev => ({ ...prev, glassMorphismIntensity: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

