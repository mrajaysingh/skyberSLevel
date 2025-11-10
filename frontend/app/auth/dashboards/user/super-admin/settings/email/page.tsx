"use client";

import { useEffect, useState, useRef } from "react";
import { SkyberSecutity } from "@/components/security/skybersecutity";
import { DashboardThemeProvider } from "@/components/dashboard/dashboard-theme-provider";
import { SuperAdminSidebar } from "@/components/dashboard/super-admin-sidebar";
import { Mail, Send, Save, Clock, Inbox, FileText, Trash2, X, CheckCircle2, XCircle, Calendar } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardBody } from "@/components/dashboard/dashboard-body";
import { Button } from "@/components/ui/button";
import { useSecurity } from "@/components/security/page-security";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast-provider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Email {
  id: string;
  to: string;
  cc?: string | null;
  bcc?: string | null;
  subject: string;
  html?: string | null;
  text?: string | null;
  status: string;
  messageId?: string | null;
  error?: string | null;
  sentAt?: string | null;
  scheduledFor?: string | null;
  createdAt: string;
  smtpSettings?: {
    provider: string;
    fromEmail: string;
    fromName: string;
  };
}

interface EmailDraft {
  id: string;
  to?: string | null;
  cc?: string | null;
  bcc?: string | null;
  subject?: string | null;
  html?: string | null;
  text?: string | null;
  updatedAt: string;
}

interface SmtpSettings {
  id: string;
  provider: string;
  fromName: string;
  fromEmail: string;
  isDefault: boolean;
}

export default function EmailComposePage() {
  const { user } = useSecurity();
  const { showSuccess, showError } = useToast();
  const [activeTab, setActiveTab] = useState("compose");
  const [sending, setSending] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Compose form state
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  
  // Data state
  const [sentEmails, setSentEmails] = useState<Email[]>([]);
  const [scheduledEmails, setScheduledEmails] = useState<Email[]>([]);
  const [drafts, setDrafts] = useState<EmailDraft[]>([]);
  const [smtpSettings, setSmtpSettings] = useState<SmtpSettings[]>([]);
  const [selectedSmtp, setSelectedSmtp] = useState<string>("");
  const [scheduledFor, setScheduledFor] = useState("");
  
  // Autocomplete state
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const toInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load data on mount
  useEffect(() => {
    loadSmtpSettings();
    loadSentEmails();
    loadScheduledEmails();
    loadDrafts();
  }, []);

  const loadSmtpSettings = async () => {
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      const response = await fetch(`${API_URL}/api/smtp`, {
        headers: {
          ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setSmtpSettings(result.data);
          const defaultSmtp = result.data.find((s: SmtpSettings) => s.isDefault) || result.data[0];
          if (defaultSmtp) {
            setSelectedSmtp(defaultSmtp.id);
          }
        }
      }
    } catch (error) {
      console.error('Error loading SMTP settings:', error);
    }
  };

  const loadSentEmails = async () => {
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      const response = await fetch(`${API_URL}/api/email/sent?limit=100`, {
        headers: {
          ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setSentEmails(result.data);
          // Extract unique email addresses from sent emails
          extractEmailAddresses(result.data);
        }
      }
    } catch (error) {
      console.error('Error loading sent emails:', error);
    }
  };

  // Extract unique email addresses from sent emails
  const extractEmailAddresses = (emails: Email[]) => {
    const emailSet = new Set<string>();
    
    emails.forEach((email) => {
      // Extract emails from 'to' field (can be comma-separated)
      if (email.to) {
        email.to.split(',').forEach((addr) => {
          const trimmed = addr.trim().toLowerCase();
          if (trimmed && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            emailSet.add(trimmed);
          }
        });
      }
      
      // Extract emails from 'cc' field
      if (email.cc) {
        email.cc.split(',').forEach((addr) => {
          const trimmed = addr.trim().toLowerCase();
          if (trimmed && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            emailSet.add(trimmed);
          }
        });
      }
      
      // Extract emails from 'bcc' field
      if (email.bcc) {
        email.bcc.split(',').forEach((addr) => {
          const trimmed = addr.trim().toLowerCase();
          if (trimmed && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            emailSet.add(trimmed);
          }
        });
      }
    });
    
    const uniqueEmails = Array.from(emailSet).sort();
    setEmailSuggestions(uniqueEmails);
  };

  const loadScheduledEmails = async () => {
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      const response = await fetch(`${API_URL}/api/email/scheduled`, {
        headers: {
          ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setScheduledEmails(result.data);
        }
      }
    } catch (error) {
      console.error('Error loading scheduled emails:', error);
    }
  };

  const loadDrafts = async () => {
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      const response = await fetch(`${API_URL}/api/email/drafts`, {
        headers: {
          ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setDrafts(result.data);
        }
      }
    } catch (error) {
      console.error('Error loading drafts:', error);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setSavingDraft(true);
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;

      const response = await fetch(`${API_URL}/api/email/draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
        },
        body: JSON.stringify({
          id: currentDraftId,
          to: to || null,
          cc: cc || null,
          bcc: bcc || null,
          subject: subject || null,
          html: html || null,
          text: html || null, // Use HTML as text fallback
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save draft');
      }

      const result = await response.json();
      if (result.success) {
        showSuccess('Draft Saved', 'Your email draft has been saved successfully.');
        if (result.data?.id) {
          setCurrentDraftId(result.data.id);
        }
        await loadDrafts();
      }
    } catch (error: any) {
      console.error('Error saving draft:', error);
      showError('Failed to Save Draft', error.message || 'Please try again later.');
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSendEmail = async () => {
    if (!to || !subject || !html) {
      showError('Validation Error', 'Please fill in To, Subject, and Message fields.');
      return;
    }

    if (!selectedSmtp) {
      showError('No SMTP Selected', 'Please configure SMTP settings first.');
      return;
    }

    try {
      setSending(true);
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;

      const body: any = {
        to,
        subject,
        html,
        smtpId: selectedSmtp,
      };

      if (cc) body.cc = cc;
      if (bcc) body.bcc = bcc;
      if (scheduledFor) body.scheduledFor = scheduledFor;

      const response = await fetch(`${API_URL}/api/email/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send email');
      }

      const result = await response.json();
      if (result.success) {
        if (scheduledFor) {
          showSuccess('Email Scheduled', 'Your email has been scheduled successfully.');
        } else {
          showSuccess('Email Sent', 'Your email has been sent successfully.');
        }
        
        // Clear form
        setTo("");
        setCc("");
        setBcc("");
        setSubject("");
        setHtml("");
        setScheduledFor("");
        setCurrentDraftId(null);
        
        // Reload data
        await loadSentEmails();
        await loadScheduledEmails();
        await loadDrafts();
        
        if (!scheduledFor) {
          setActiveTab("sent");
        }
      }
    } catch (error: any) {
      console.error('Error sending email:', error);
      showError('Failed to Send Email', error.message || 'Please try again later.');
    } finally {
      setSending(false);
    }
  };

  const handleLoadDraft = (draft: EmailDraft) => {
    setTo(draft.to || "");
    setCc(draft.cc || "");
    setBcc(draft.bcc || "");
    setSubject(draft.subject || "");
    setHtml(draft.html || draft.text || "");
    setCurrentDraftId(draft.id);
    setActiveTab("compose");
  };

  const handleDeleteDraft = async (id: string) => {
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      const response = await fetch(`${API_URL}/api/email/drafts/${id}`, {
        method: 'DELETE',
        headers: {
          ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
        },
      });

      if (response.ok) {
        showSuccess('Draft Deleted', 'Draft has been deleted successfully.');
        await loadDrafts();
        if (currentDraftId === id) {
          setCurrentDraftId(null);
          setTo("");
          setCc("");
          setBcc("");
          setSubject("");
          setHtml("");
        }
      }
    } catch (error) {
      console.error('Error deleting draft:', error);
      showError('Failed to Delete Draft', 'Please try again later.');
    }
  };

  const handleCancelScheduled = async (id: string) => {
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      const response = await fetch(`${API_URL}/api/email/scheduled/${id}`, {
        method: 'DELETE',
        headers: {
          ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
        },
      });

      if (response.ok) {
        showSuccess('Scheduled Email Cancelled', 'Scheduled email has been cancelled successfully.');
        await loadScheduledEmails();
      }
    } catch (error) {
      console.error('Error cancelling scheduled email:', error);
      showError('Failed to Cancel', 'Please try again later.');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadSentEmails(),
        loadScheduledEmails(),
        loadDrafts(),
        loadSmtpSettings(),
      ]);
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Handle To field input change with autocomplete
  const handleToChange = (value: string) => {
    setTo(value);
    
    // Get the last email being typed (after the last comma)
    const lastCommaIndex = value.lastIndexOf(',');
    const currentInput = lastCommaIndex >= 0 
      ? value.substring(lastCommaIndex + 1).trim() 
      : value.trim();
    
    // Only show suggestions if:
    // 1. There's some input
    // 2. The input doesn't already contain a complete email (no @ or ends with @)
    // 3. We have email suggestions available
    if (currentInput.length > 0 && emailSuggestions.length > 0) {
      // Check if current input is already a complete email
      const isCompleteEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentInput);
      
      if (!isCompleteEmail) {
        // Filter suggestions based on current input (case-insensitive)
        const filtered = emailSuggestions.filter((email) =>
          email.toLowerCase().includes(currentInput.toLowerCase()) &&
          email.toLowerCase() !== currentInput.toLowerCase() // Don't show exact match
        );
        setFilteredSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
        setSelectedSuggestionIndex(-1);
      } else {
        // Complete email entered, hide suggestions
        setShowSuggestions(false);
        setFilteredSuggestions([]);
      }
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (email: string) => {
    const currentValue = to;
    const lastCommaIndex = currentValue.lastIndexOf(',');
    
    // If there's a comma, replace everything after it with the selected email
    // Otherwise, replace the entire value
    let newValue: string;
    if (lastCommaIndex >= 0) {
      const beforeComma = currentValue.substring(0, lastCommaIndex + 1).trim();
      newValue = beforeComma + ' ' + email;
    } else {
      newValue = email;
    }
    
    setTo(newValue);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
    setSelectedSuggestionIndex(-1);
    
    // Focus back on input after a short delay to ensure state is updated
    setTimeout(() => {
      toInputRef.current?.focus();
      // Move cursor to end of input
      if (toInputRef.current) {
        toInputRef.current.setSelectionRange(newValue.length, newValue.length);
      }
    }, 0);
  };

  // Handle keyboard navigation in suggestions
  const handleToKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      handleSuggestionSelect(filteredSuggestions[selectedSuggestionIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toInputRef.current &&
        !toInputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <SkyberSecutity>
      <DashboardThemeProvider>
        <div className="flex min-h-screen bg-background">
          <SuperAdminSidebar />
          <main className="w-full">
            <DashboardHeader
              title="Email"
              subtitle="Compose and manage your emails"
              onRefresh={handleRefresh}
              refreshing={refreshing}
            />
            <DashboardBody>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="compose">
                    <Mail className="h-4 w-4 mr-2" />
                    Compose
                  </TabsTrigger>
                  <TabsTrigger value="sent">
                    <Inbox className="h-4 w-4 mr-2" />
                    Sent ({sentEmails.length})
                  </TabsTrigger>
                  <TabsTrigger value="scheduled">
                    <Clock className="h-4 w-4 mr-2" />
                    Scheduled ({scheduledEmails.length})
                  </TabsTrigger>
                  <TabsTrigger value="drafts">
                    <FileText className="h-4 w-4 mr-2" />
                    Drafts ({drafts.length})
                  </TabsTrigger>
                </TabsList>

                {/* Compose Tab */}
                <TabsContent value="compose" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Compose Email</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* SMTP Selection */}
                      {smtpSettings.length > 0 && (
                        <div className="space-y-2">
                          <Label htmlFor="smtp">SMTP Account</Label>
                          <Select value={selectedSmtp} onValueChange={setSelectedSmtp}>
                            <SelectTrigger id="smtp">
                              <SelectValue placeholder="Select SMTP account" />
                            </SelectTrigger>
                            <SelectContent>
                              {smtpSettings.map((smtp) => (
                                <SelectItem key={smtp.id} value={smtp.id}>
                                  {smtp.fromName} ({smtp.fromEmail}) {smtp.isDefault && "- Default"}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* To */}
                      <div className="space-y-2 relative">
                        <Label htmlFor="to">To *</Label>
                        <div className="relative">
                          <Input
                            ref={toInputRef}
                            id="to"
                            value={to}
                            onChange={(e) => handleToChange(e.target.value)}
                            onKeyDown={handleToKeyDown}
                            onFocus={() => {
                              if (filteredSuggestions.length > 0) {
                                setShowSuggestions(true);
                              }
                            }}
                            placeholder="recipient@example.com, another@example.com"
                          />
                          {showSuggestions && filteredSuggestions.length > 0 && (
                            <div
                              ref={suggestionsRef}
                              className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto"
                            >
                              {filteredSuggestions.map((email, index) => (
                                <div
                                  key={email}
                                  onClick={() => handleSuggestionSelect(email)}
                                  className={`px-3 py-2 cursor-pointer text-sm hover:bg-accent ${
                                    index === selectedSuggestionIndex ? 'bg-accent' : ''
                                  }`}
                                >
                                  {email}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CC */}
                      <div className="space-y-2">
                        <Label htmlFor="cc">CC</Label>
                        <Input
                          id="cc"
                          value={cc}
                          onChange={(e) => setCc(e.target.value)}
                          placeholder="cc@example.com"
                        />
                      </div>

                      {/* BCC */}
                      <div className="space-y-2">
                        <Label htmlFor="bcc">BCC</Label>
                        <Input
                          id="bcc"
                          value={bcc}
                          onChange={(e) => setBcc(e.target.value)}
                          placeholder="bcc@example.com"
                        />
                      </div>

                      {/* Subject */}
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="Email subject"
                        />
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <Label htmlFor="html">Message *</Label>
                        <Textarea
                          id="html"
                          value={html}
                          onChange={(e) => setHtml(e.target.value)}
                          placeholder="Type your message here..."
                          rows={10}
                          className="font-mono"
                        />
                        <p className="text-xs text-muted-foreground">
                          You can use HTML tags for formatting
                        </p>
                      </div>

                      {/* Schedule */}
                      <div className="space-y-2">
                        <Label htmlFor="scheduledFor">Schedule (Optional)</Label>
                          <Input
                            id="scheduledFor"
                            type="datetime-local"
                            value={scheduledFor}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScheduledFor(e.target.value)}
                          />
                        <p className="text-xs text-muted-foreground">
                          Leave empty to send immediately
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-4 border-t">
                        <Button onClick={handleSendEmail} disabled={sending || !selectedSmtp}>
                          <Send className="h-4 w-4 mr-2" />
                          {sending ? 'Sending...' : scheduledFor ? 'Schedule' : 'Send'}
                        </Button>
                        <Button onClick={handleSaveDraft} variant="outline" disabled={savingDraft}>
                          <Save className="h-4 w-4 mr-2" />
                          {savingDraft ? 'Saving...' : 'Save Draft'}
                        </Button>
                        <Button
                          onClick={() => {
                            setTo("");
                            setCc("");
                            setBcc("");
                            setSubject("");
                            setHtml("");
                            setScheduledFor("");
                            setCurrentDraftId(null);
                          }}
                          variant="outline"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Clear
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Sent Tab */}
                <TabsContent value="sent" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sent Emails</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {sentEmails.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No sent emails</p>
                      ) : (
                        <div className="space-y-4">
                          {sentEmails.map((email) => (
                            <div key={email.id} className="border rounded-lg p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {email.status === 'sent' ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : email.status === 'scheduled' || email.scheduledFor ? (
                                    <Clock className="h-4 w-4 text-yellow-500" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  )}
                                  <Badge variant={email.status === 'sent' ? 'default' : 'secondary'}>
                                    {email.status}
                                  </Badge>
                                  <span className="text-sm font-medium">{email.subject}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {email.scheduledFor && email.status === 'scheduled' 
                                    ? `Scheduled: ${new Date(email.scheduledFor).toLocaleString()}`
                                    : new Date(email.sentAt || email.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <div className="text-sm space-y-1">
                                <p><strong>To:</strong> {email.to}</p>
                                {email.cc && <p><strong>CC:</strong> {email.cc}</p>}
                                {email.bcc && <p><strong>BCC:</strong> {email.bcc}</p>}
                                {email.messageId && (
                                  <p className="text-xs text-muted-foreground">
                                    Message ID: {email.messageId}
                                  </p>
                                )}
                                {email.error && (
                                  <p className="text-red-500"><strong>Error:</strong> {email.error}</p>
                                )}
                                {email.smtpSettings && (
                                  <p className="text-xs text-muted-foreground">
                                    Sent via {email.smtpSettings.provider} ({email.smtpSettings.fromEmail})
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Scheduled Tab */}
                <TabsContent value="scheduled" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Scheduled Emails</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {scheduledEmails.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No scheduled emails</p>
                      ) : (
                        <div className="space-y-4">
                          {scheduledEmails.map((email) => (
                            <div key={email.id} className="border rounded-lg p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-blue-500" />
                                  <span className="text-sm font-medium">{email.subject}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 inline mr-1" />
                                    {email.scheduledFor ? new Date(email.scheduledFor).toLocaleString() : 'N/A'}
                                  </span>
                                  <Button
                                    onClick={() => handleCancelScheduled(email.id)}
                                    variant="outline"
                                    size="sm"
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                              <div className="text-sm space-y-1">
                                <p><strong>To:</strong> {email.to}</p>
                                {email.cc && <p><strong>CC:</strong> {email.cc}</p>}
                                {email.bcc && <p><strong>BCC:</strong> {email.bcc}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Drafts Tab */}
                <TabsContent value="drafts" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Drafts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {drafts.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No drafts</p>
                      ) : (
                        <div className="space-y-4">
                          {drafts.map((draft) => (
                            <div key={draft.id} className="border rounded-lg p-4 space-y-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{draft.subject || '(No subject)'}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {draft.to || '(No recipient)'}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(draft.updatedAt).toLocaleString()}
                                  </span>
                                  <Button
                                    onClick={() => handleLoadDraft(draft)}
                                    variant="outline"
                                    size="sm"
                                  >
                                    Open
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteDraft(draft.id)}
                                    variant="outline"
                                    size="sm"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </DashboardBody>
          </main>
        </div>
      </DashboardThemeProvider>
    </SkyberSecutity>
  );
}
