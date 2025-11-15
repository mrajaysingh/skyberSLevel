"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Plus, X, Save, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";
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

interface TeamMember {
  id: string;
  name: string;
  designation: string;
  image: string;
  bio: string;
  expertise: string[];
}

interface Stat {
  id: string;
  label: string;
  value: string;
  icon: string;
}

interface Value {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface AboutConfig {
  leadershipTeam: {
    title: string;
    description: string;
    members: TeamMember[];
  };
  stats: Stat[];
  coreValues: {
    title: string;
    description: string;
    values: Value[];
  };
  mission: {
    title: string;
    paragraphs: string[];
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

export function AboutUsEditor() {
  const [config, setConfig] = useState<AboutConfig>({
    leadershipTeam: {
      title: "Meet Our Leadership Team",
      description: "The visionaries and experts driving SKYBER's mission to deliver exceptional digital solutions.",
      members: [
        {
          id: "1",
          name: "Founder",
          designation: "CEO & Founder",
          image: "/Default/founder-placeholder.png",
          bio: "Visionary leader driving innovation in cybersecurity and web development. With a passion for excellence and a commitment to client success, the founder has built SKYBER into a trusted partner for businesses seeking secure, scalable digital solutions.",
          expertise: ["Strategic Leadership", "Business Development", "Innovation"]
        },
        {
          id: "2",
          name: "Ajay Singh",
          designation: "CTO (Chief Technology Officer)",
          image: "/Default/founder-placeholder.png",
          bio: "Technology expert with extensive experience in architecting secure, scalable systems. Leads our technical team in delivering cutting-edge solutions that combine innovation with reliability.",
          expertise: ["System Architecture", "Cybersecurity", "Cloud Infrastructure"]
        },
        {
          id: "3",
          name: "Design Head",
          designation: "CDO (Chief Design Officer)",
          image: "/Default/founder-placeholder.png",
          bio: "Creative visionary transforming ideas into beautiful, user-centric experiences. Specializes in creating intuitive interfaces that not only look stunning but also drive business results.",
          expertise: ["UI/UX Design", "Design Systems", "User Research"]
        }
      ]
    },
    stats: [
      { id: "1", label: "Projects Delivered", value: "250+", icon: "Code" },
      { id: "2", label: "Client Satisfaction", value: "97%", icon: "Heart" },
      { id: "3", label: "Years Experience", value: "4+", icon: "Award" },
      { id: "4", label: "Security Incidents", value: "0", icon: "Shield" }
    ],
    coreValues: {
      title: "Our Core Values",
      description: "The principles that guide everything we do at SKYBER.",
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
      ]
    },
    mission: {
      title: "Our Mission",
      paragraphs: [
        "At SKYBER, we believe in creating digital solutions that are not just functional, but secure, scalable, and built to last. Our mission is to bridge the gap between cutting-edge technology and practical business needs.",
        "We're committed to delivering solutions that empower businesses, not complicate them. Every project is an opportunity to make a meaningful impact, and we approach each one with dedication, expertise, and a genuine passion for excellence.",
        "Whether you're looking to secure your digital infrastructure, build a cutting-edge web application, or transform your business with custom software solutions, SKYBER is here to help you achieve your goals."
      ]
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    leadershipTeam: false,
    stats: false,
    coreValues: false,
    mission: false
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
        if (data.success && data.data?.about) {
          setConfig(data.data.about);
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
        body: JSON.stringify({ about: config }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to save' }));
        throw new Error(errorData.error || 'Failed to save configuration');
      }

      showSuccess('Success', 'About Us page configuration saved successfully');
    } catch (error: any) {
      showError('Save Failed', error.message || 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (memberId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImages(prev => ({ ...prev, [memberId]: true }));
    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig(prev => ({
          ...prev,
          leadershipTeam: {
            ...prev.leadershipTeam,
            members: prev.leadershipTeam.members.map(m =>
              m.id === memberId ? { ...m, image: reader.result as string } : m
            )
          }
        }));
      };
      reader.readAsDataURL(file);

      // Upload to S3
      const member = config.leadershipTeam.members.find(m => m.id === memberId);
      const imageKey = `team-member-${memberId}`;
      const result = await uploadImageToS3({
        category: 'content-pages',
        subcategory: 'about-us',
        imageKey,
        file
      });

      if (result.success && result.url) {
        setConfig(prev => ({
          ...prev,
          leadershipTeam: {
            ...prev.leadershipTeam,
            members: prev.leadershipTeam.members.map(m =>
              m.id === memberId ? { ...m, image: result.url! } : m
            )
          }
        }));
        showSuccess('Success', 'Team member photo uploaded to S3 successfully');
      } else {
        showError('Upload Failed', result.error || 'Failed to upload image');
      }
    } catch (error: any) {
      showError('Upload Failed', error.message || 'Failed to upload image');
    } finally {
      setUploadingImages(prev => ({ ...prev, [memberId]: false }));
    }
  };

  const addTeamMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: "",
      designation: "",
      image: "/Default/founder-placeholder.png",
      bio: "",
      expertise: []
    };
    setConfig(prev => ({
      ...prev,
      leadershipTeam: {
        ...prev.leadershipTeam,
        members: [...prev.leadershipTeam.members, newMember]
      }
    }));
  };

  const removeTeamMember = (id: string) => {
    setConfig(prev => ({
      ...prev,
      leadershipTeam: {
        ...prev.leadershipTeam,
        members: prev.leadershipTeam.members.filter(m => m.id !== id)
      }
    }));
  };

  const updateTeamMember = (id: string, field: keyof TeamMember, value: any) => {
    setConfig(prev => ({
      ...prev,
      leadershipTeam: {
        ...prev.leadershipTeam,
        members: prev.leadershipTeam.members.map(m =>
          m.id === id ? { ...m, [field]: value } : m
        )
      }
    }));
  };

  const addExpertise = (memberId: string) => {
    setConfig(prev => ({
      ...prev,
      leadershipTeam: {
        ...prev.leadershipTeam,
        members: prev.leadershipTeam.members.map(m =>
          m.id === memberId ? { ...m, expertise: [...m.expertise, ""] } : m
        )
      }
    }));
  };

  const updateExpertise = (memberId: string, index: number, value: string) => {
    setConfig(prev => ({
      ...prev,
      leadershipTeam: {
        ...prev.leadershipTeam,
        members: prev.leadershipTeam.members.map(m =>
          m.id === memberId
            ? {
                ...m,
                expertise: m.expertise.map((exp, i) => i === index ? value : exp)
              }
            : m
        )
      }
    }));
  };

  const removeExpertise = (memberId: string, index: number) => {
    setConfig(prev => ({
      ...prev,
      leadershipTeam: {
        ...prev.leadershipTeam,
        members: prev.leadershipTeam.members.map(m =>
          m.id === memberId
            ? { ...m, expertise: m.expertise.filter((_, i) => i !== index) }
            : m
        )
      }
    }));
  };

  const addStat = () => {
    const newStat: Stat = {
      id: Date.now().toString(),
      label: "",
      value: "",
      icon: "Code"
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

  const updateStat = (id: string, field: keyof Stat, value: string) => {
    setConfig(prev => ({
      ...prev,
      stats: prev.stats.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
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
      coreValues: {
        ...prev.coreValues,
        values: [...prev.coreValues.values, newValue]
      }
    }));
  };

  const removeValue = (id: string) => {
    setConfig(prev => ({
      ...prev,
      coreValues: {
        ...prev.coreValues,
        values: prev.coreValues.values.filter(v => v.id !== id)
      }
    }));
  };

  const updateValue = (id: string, field: keyof Value, value: string) => {
    setConfig(prev => ({
      ...prev,
      coreValues: {
        ...prev.coreValues,
        values: prev.coreValues.values.map(v => v.id === id ? { ...v, [field]: value } : v)
      }
    }));
  };

  const addMissionParagraph = () => {
    setConfig(prev => ({
      ...prev,
      mission: {
        ...prev.mission,
        paragraphs: [...prev.mission.paragraphs, ""]
      }
    }));
  };

  const updateMissionParagraph = (index: number, value: string) => {
    setConfig(prev => ({
      ...prev,
      mission: {
        ...prev.mission,
        paragraphs: prev.mission.paragraphs.map((p, i) => i === index ? value : p)
      }
    }));
  };

  const removeMissionParagraph = (index: number) => {
    setConfig(prev => ({
      ...prev,
      mission: {
        ...prev.mission,
        paragraphs: prev.mission.paragraphs.filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h2 className="text-2xl font-semibold">Edit About Us Page</h2>
          <p className="text-muted-foreground">
            Customize all sections of the About Us page
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="lg"
          className="shrink-0"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      {/* Leadership Team Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('leadershipTeam')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Leadership Team Section</CardTitle>
              <CardDescription>
                Edit team members, their photos, descriptions, and expertise tags
              </CardDescription>
            </div>
            {expandedSections.leadershipTeam ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.leadershipTeam && (
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input
                value={config.leadershipTeam.title}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  leadershipTeam: { ...prev.leadershipTeam, title: e.target.value }
                }))}
                placeholder="Meet Our Leadership Team"
              />
            </div>
            <div className="space-y-2">
              <Label>Section Description</Label>
              <Textarea
                value={config.leadershipTeam.description}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  leadershipTeam: { ...prev.leadershipTeam, description: e.target.value }
                }))}
                placeholder="The visionaries and experts driving SKYBER's mission..."
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Team Members</Label>
                <Button onClick={addTeamMember} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>

              {config.leadershipTeam.members.map((member, index) => (
                <Card key={member.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Member {index + 1}</CardTitle>
                      {config.leadershipTeam.members.length > 1 && (
                        <Button
                          onClick={() => removeTeamMember(member.id)}
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={member.name}
                          onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                          placeholder="Founder"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Designation</Label>
                        <Input
                          value={member.designation}
                          onChange={(e) => updateTeamMember(member.id, 'designation', e.target.value)}
                          placeholder="CEO & Founder"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Photo</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                          <NextImage
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <Input
                            type="text"
                            value={member.image}
                            onChange={(e) => updateTeamMember(member.id, 'image', e.target.value)}
                            placeholder="/Default/founder-placeholder.png"
                            className="mb-2"
                          />
                          <Label htmlFor={`upload-${member.id}`} className="cursor-pointer">
                            <Button type="button" size="sm" variant="outline" asChild disabled={uploadingImages[member.id]}>
                              <span>
                                <Upload className="h-4 w-4 mr-2" />
                                {uploadingImages[member.id] ? 'Uploading...' : 'Upload Image'}
                              </span>
                            </Button>
                            <input
                              id={`upload-${member.id}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(member.id, e)}
                              disabled={uploadingImages[member.id]}
                            />
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Bio</Label>
                      <Textarea
                        value={member.bio}
                        onChange={(e) => updateTeamMember(member.id, 'bio', e.target.value)}
                        placeholder="Visionary leader driving innovation..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Expertise Tags</Label>
                        <Button
                          onClick={() => addExpertise(member.id)}
                          size="sm"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Tag
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((exp, expIndex) => (
                          <div key={expIndex} className="flex items-center gap-2">
                            <Input
                              value={exp}
                              onChange={(e) => updateExpertise(member.id, expIndex, e.target.value)}
                              placeholder="Strategic Leadership"
                              className="w-40"
                            />
                            <Button
                              onClick={() => removeExpertise(member.id, expIndex)}
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
              <CardDescription>
                Edit counters and statistics displayed on the page
              </CardDescription>
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
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Label</Label>
                      <Input
                        value={stat.label}
                        onChange={(e) => updateStat(stat.id, 'label', e.target.value)}
                        placeholder="Projects Delivered"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input
                        value={stat.value}
                        onChange={(e) => updateStat(stat.id, 'value', e.target.value)}
                        placeholder="250+"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <select
                        value={stat.icon}
                        onChange={(e) => updateStat(stat.id, 'icon', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      >
                        {Object.keys(iconMap).map(iconName => (
                          <option key={iconName} value={iconName}>{iconName}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Core Values Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('coreValues')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Core Values Section</CardTitle>
              <CardDescription>
                Edit values, their icons, titles, and descriptions
              </CardDescription>
            </div>
            {expandedSections.coreValues ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.coreValues && (
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input
                value={config.coreValues.title}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  coreValues: { ...prev.coreValues, title: e.target.value }
                }))}
                placeholder="Our Core Values"
              />
            </div>
            <div className="space-y-2">
              <Label>Section Description</Label>
              <Textarea
                value={config.coreValues.description}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  coreValues: { ...prev.coreValues, description: e.target.value }
                }))}
                placeholder="The principles that guide everything we do at SKYBER."
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Values</Label>
                <Button onClick={addValue} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Value
                </Button>
              </div>

              {config.coreValues.values.map((value, index) => (
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
            </div>
          </CardContent>
        )}
      </Card>

      {/* Mission Section */}
      <Card>
        <CardHeader>
          <button
            onClick={() => toggleSection('mission')}
            className="w-full flex items-center justify-between text-left"
          >
            <div>
              <CardTitle>Mission Section</CardTitle>
              <CardDescription>
                Edit mission title and description paragraphs
              </CardDescription>
            </div>
            {expandedSections.mission ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </CardHeader>
        {expandedSections.mission && (
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input
                value={config.mission.title}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  mission: { ...prev.mission, title: e.target.value }
                }))}
                placeholder="Our Mission"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Mission Paragraphs</Label>
                <Button onClick={addMissionParagraph} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Paragraph
                </Button>
              </div>

              {config.mission.paragraphs.map((paragraph, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Textarea
                    value={paragraph}
                    onChange={(e) => updateMissionParagraph(index, e.target.value)}
                    placeholder="At SKYBER, we believe in creating digital solutions..."
                    rows={4}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => removeMissionParagraph(index)}
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
    </div>
  );
}

