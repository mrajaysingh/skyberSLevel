"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, Plus, X, Trash2, Edit, Bold, Italic, Underline, Image, Type, Palette, FileText, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface EmailTemplate {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  subject: string;
  html: string;
  text: string | null;
  variables: string[];
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function EmailTemplateEditor() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const { showSuccess, showError } = useToast();

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [text, setText] = useState("");
  const [variables, setVariables] = useState<string[]>([]);
  const [previewHtml, setPreviewHtml] = useState("");

  const editorRef = useRef<HTMLDivElement>(null);

  const availableVariables = ['username', 'email', 'name', 'company', 'date', 'year'];

  // Sample data for preview
  const previewData = {
    username: 'john_doe',
    email: 'john.doe@example.com',
    name: 'John Doe',
    company: 'Acme Corp',
    date: new Date().toLocaleDateString(),
    year: new Date().getFullYear().toString(),
  };

  // Replace variables in HTML for preview
  const getPreviewHtml = useCallback((htmlContent: string) => {
    if (!htmlContent || !htmlContent.trim()) {
      return "<p style='color: #999; font-style: italic;'>Start typing to see preview...</p>";
    }
    let previewHtml = htmlContent;
    availableVariables.forEach((varName) => {
      const regex = new RegExp(`\\{${varName}\\}`, 'g');
      previewHtml = previewHtml.replace(regex, previewData[varName as keyof typeof previewData] || `{${varName}}`);
    });
    return previewHtml;
  }, []);

  useEffect(() => {
    loadTemplates();
  }, []);

  // Update preview HTML in real-time whenever html changes
  useEffect(() => {
    if (showPreview) {
      const previewContent = getPreviewHtml(html);
      setPreviewHtml(previewContent);
    } else {
      setPreviewHtml("");
    }
  }, [html, subject, showPreview, getPreviewHtml]);

  const loadTemplates = async () => {
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) return;

      const response = await fetch(`${API_URL}/api/email-templates`, {
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTemplates(data.data || []);
        }
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setIsEditing(true);
    setName("");
    setCategory("newsletter");
    setDescription("");
    setSubject("");
    setHtml("");
    setText("");
    setVariables([]);
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsEditing(true);
    setName(template.name);
    setCategory(template.category || "");
    setDescription(template.description || "");
    setSubject(template.subject);
    setHtml(template.html);
    setText(template.text || "");
    setVariables(template.variables || []);
    if (editorRef.current) {
      editorRef.current.innerHTML = template.html;
    }
  };

  const handleSave = async () => {
    if (!name || !subject || !html) {
      showError("Name, subject, and HTML content are required");
      return;
    }

    setIsSaving(true);
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        showError("Authentication required");
        return;
      }

      const templateData = {
        name,
        category: category || null,
        description: description || null,
        subject,
        html,
        text: text || null,
        variables,
        isActive: true,
      };

      const url = selectedTemplate
        ? `${API_URL}/api/email-templates/${selectedTemplate.id}`
        : `${API_URL}/api/email-templates`;

      const response = await fetch(url, {
        method: selectedTemplate ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(templateData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccess(selectedTemplate ? "Template updated successfully" : "Template created successfully");
        setIsEditing(false);
        setSelectedTemplate(null);
        loadTemplates();
      } else {
        showError(data.message || "Failed to save template");
      }
    } catch (error: any) {
      showError(error.message || "Failed to save template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        showError("Authentication required");
        return;
      }

      const response = await fetch(`${API_URL}/api/email-templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionToken}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccess("Template deleted successfully");
        if (selectedTemplate?.id === id) {
          setSelectedTemplate(null);
          setIsEditing(false);
        }
        loadTemplates();
      } else {
        showError(data.message || "Failed to delete template");
      }
    } catch (error: any) {
      showError(error.message || "Failed to delete template");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedTemplate(null);
  };

  // Rich text editor functions
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateHtml();
  };

  const updateHtml = () => {
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      setHtml(newHtml);
    }
  };

  const insertVariable = (variable: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const textNode = document.createTextNode(`{${variable}}`);
      range.insertNode(textNode);
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
      updateHtml();
    } else if (editorRef.current) {
      editorRef.current.innerHTML += `{${variable}}`;
      updateHtml();
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      execCommand('insertImage', url);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading templates...</div>;
  }

  return (
    <div className="space-y-4">
      {!isEditing ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Email Templates</h3>
              <p className="text-sm text-muted-foreground">Create and manage reusable email templates</p>
            </div>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>

          <div className="grid gap-4">
            {templates.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No templates yet. Create your first template!</p>
                </CardContent>
              </Card>
            ) : (
              templates.map((template) => (
                <Card key={template.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{template.name}</h4>
                          {template.category && (
                            <Badge variant="outline">{template.category}</Badge>
                          )}
                          {template.isDefault && (
                            <Badge variant="default">Default</Badge>
                          )}
                        </div>
                        {template.description && (
                          <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                        )}
                        <p className="text-sm font-medium mb-1">Subject: {template.subject}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.variables.map((varName) => (
                            <Badge key={varName} variant="secondary" className="text-xs">
                              {`{${varName}}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(template.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{selectedTemplate ? "Edit Template" : "New Template"}</CardTitle>
            <CardDescription>
              Create an email template with rich text formatting and variables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Template Name *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Newsletter Welcome"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="transactional">Transactional</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Template description"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Subject *</Label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Welcome to SKYBER!"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>HTML Content *</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    title={showPreview ? "Hide Preview" : "Show Preview"}
                  >
                    {showPreview ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        Hide Preview
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </>
                    )}
                  </Button>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => execCommand('bold')}
                      title="Bold"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => execCommand('italic')}
                      title="Italic"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => execCommand('underline')}
                      title="Underline"
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={insertImage}
                      title="Insert Image"
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="border-l mx-1" />
                  <div className="flex gap-1">
                    {availableVariables.map((varName) => (
                      <Button
                        key={varName}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => insertVariable(varName)}
                        title={`Insert {${varName}}`}
                      >
                        {`{${varName}}`}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              {showPreview ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Editor</Label>
                    <div
                      ref={editorRef}
                      contentEditable
                      className="min-h-[400px] border rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-ring overflow-y-auto"
                      onInput={updateHtml}
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Preview (Real-time)</Label>
                    <div className="min-h-[400px] border rounded-md bg-gray-50 overflow-y-auto">
                      {/* Email Header Simulation */}
                      <div className="bg-white border-b p-3">
                        <div className="text-xs text-muted-foreground mb-1">From: newsletter@skyber.dev</div>
                        <div className="text-xs text-muted-foreground mb-1">To: {previewData.email}</div>
                        <div className="text-xs text-muted-foreground mb-2">Subject: {subject || "Email Subject"}</div>
                        <div className="border-t pt-2"></div>
                      </div>
                      {/* Email Body */}
                      <div className="bg-white p-6">
                        <div
                          className="prose prose-sm max-w-none"
                          style={{
                            fontFamily: 'system-ui, -apple-system, sans-serif',
                            lineHeight: '1.6',
                            color: '#333',
                          }}
                          dangerouslySetInnerHTML={{ __html: previewHtml }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  ref={editorRef}
                  contentEditable
                  className="min-h-[400px] border rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-ring overflow-y-auto"
                  onInput={updateHtml}
                  dangerouslySetInnerHTML={{ __html: html }}
                ></div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Plain Text (optional)</Label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Plain text version of the email"
                rows={5}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Template"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

