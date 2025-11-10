"use client";

import { useEffect, useState } from "react";
import { SkyberSecutity } from "@/components/security/skybersecutity";
import { DashboardThemeProvider } from "@/components/dashboard/dashboard-theme-provider";
import { SuperAdminSidebar } from "@/components/dashboard/super-admin-sidebar";
import { Mail, Edit, Save, X, TestTube, CheckCircle2, XCircle, Clock, History, ChevronDown, ChevronUp, Code } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardBody } from "@/components/dashboard/dashboard-body";
import { Button } from "@/components/ui/button";
import { useSecurity } from "@/components/security/page-security";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Debug: Log API URL to verify it's correct
if (typeof window !== 'undefined') {
  console.log('🔗 API_URL:', API_URL);
}

// SMTP Providers configuration
const SMTP_PROVIDERS = [
  { value: 'brevo', label: 'Brevo (Sendinblue)', host: 'smtp-relay.brevo.com', port: 587, secure: false },
  { value: 'gmail', label: 'Gmail', host: 'smtp.gmail.com', port: 587, secure: false },
  { value: 'outlook', label: 'Outlook/Hotmail', host: 'smtp-mail.outlook.com', port: 587, secure: false },
  { value: 'yahoo', label: 'Yahoo Mail', host: 'smtp.mail.yahoo.com', port: 587, secure: false },
  { value: 'custom', label: 'Custom SMTP', host: '', port: 587, secure: false },
];

interface SmtpSettings {
  id?: string;
  provider: string;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  toEmail: string;
  isDefault: boolean;
  isActive: boolean;
  lastTestStatus?: string | null;
  lastTestAt?: string | null;
  lastTestError?: string | null;
}

interface SmtpLog {
  id: string;
  smtpId: string;
  userId: string;
  action: string;
  timestamp: string;
  settings: {
    provider: string;
    host: string;
    port: number;
    secure: boolean;
    username: string;
    fromName: string;
    fromEmail: string;
    toEmail: string | null;
  };
  testStatus?: string;
  testError?: string | null;
}

export default function IntegrationsPage() {
  const { user } = useSecurity();
  const { showSuccess, showError } = useToast();
  const [emailSectionExpanded, setEmailSectionExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [smtpSettings, setSmtpSettings] = useState<SmtpSettings[]>([]);
  const [selectedSmtp, setSelectedSmtp] = useState<SmtpSettings | null>(null);
  const [formData, setFormData] = useState<SmtpSettings>({
    provider: 'brevo',
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    username: '',
    password: '',
    fromName: 'SKYBER TECHNOLOGIES',
    fromEmail: 'informer@skyber.dev',
    toEmail: user?.email || '',
    isDefault: false,
    isActive: true,
  });
  const [logs, setLogs] = useState<SmtpLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Load SMTP settings on mount
  useEffect(() => {
    loadSmtpSettings();
  }, []);

  // Auto-refresh SMTP settings every 3 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      loadSmtpSettings();
    }, 3 * 60 * 1000); // 3 minutes in milliseconds

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Update form data when provider changes
  useEffect(() => {
    if (formData.provider && formData.provider !== 'custom') {
      const provider = SMTP_PROVIDERS.find(p => p.value === formData.provider);
      if (provider) {
        setFormData(prev => ({
          ...prev,
          host: provider.host,
          port: provider.port,
          secure: provider.secure,
        }));
      }
    }
  }, [formData.provider]);

  const loadSmtpSettings = async () => {
    try {
      setLoading(true);
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      
      // Debug: Log the request URL
      console.log('📡 Fetching SMTP settings from:', `${API_URL}/api/smtp`);
      
      const response = await fetch(`${API_URL}/api/smtp`, {
        headers: {
          ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
        },
      });

      if (!response.ok) throw new Error('Failed to load SMTP settings');

      const result = await response.json();
      if (result.success && result.data) {
        setSmtpSettings(result.data);
        // Select default or first SMTP setting
        const defaultSmtp = result.data.find((s: SmtpSettings) => s.isDefault) || result.data[0];
        if (defaultSmtp) {
          setSelectedSmtp(defaultSmtp);
          setFormData({
            ...defaultSmtp,
            password: '', // Don't show password
          });
        }
      }
    } catch (error) {
      console.error('Error loading SMTP settings:', error);
      showError('Failed to load SMTP settings', 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (selectedSmtp) {
      setFormData({
        ...selectedSmtp,
        password: '', // Don't show password
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;

      if (!formData.host || !formData.port || !formData.username || !formData.password || !formData.fromEmail) {
        showError('Validation Error', 'Please fill in all required fields.');
        return;
      }

      const url = selectedSmtp?.id
        ? `${API_URL}/api/smtp/${selectedSmtp.id}`
        : `${API_URL}/api/smtp`;

      const method = selectedSmtp?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save SMTP settings');
      }

      const result = await response.json();
      if (result.success) {
        showSuccess('SMTP Settings Saved', 'Your SMTP configuration has been saved successfully.');
        setIsEditing(false);
        await loadSmtpSettings();
      }
    } catch (error: any) {
      console.error('Error saving SMTP settings:', error);
      showError('Failed to Save', error.message || 'Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    if (!selectedSmtp?.id) {
      showError('No SMTP Selected', 'Please save your SMTP settings first.');
      return;
    }

    try {
      setTesting(true);
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;

      const response = await fetch(`${API_URL}/api/smtp/${selectedSmtp.id}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
        },
        body: JSON.stringify({
          toEmail: formData.toEmail || user?.email,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to test connection');
      }

      const result = await response.json();
      const recipientEmail = formData.toEmail || user?.email;
      
      if (result.success) {
        const message = result.message || `Your SMTP configuration is working correctly. A test email has been sent to ${recipientEmail}. Please check your inbox (and spam folder). Allow a few minutes for delivery.`;
        showSuccess('Connection Test Successful', message);
        
        // Log details to console for debugging
        if (result.details) {
          console.log('Email send details:', {
            messageId: result.details.messageId,
            accepted: result.details.accepted,
            response: result.details.response,
            recipient: recipientEmail,
          });
        }
      } else {
        showError(
          'Connection Test Failed', 
          result.error || result.message || 'Please check your SMTP settings and try again.'
        );
      }

      // Note: SMTP settings will be auto-refreshed every 3 minutes
      // No immediate reload needed after test to avoid connection issues
    } catch (error: any) {
      console.error('Error testing SMTP connection:', error);
      showError('Test Failed', error.message || 'Please try again later.');
    } finally {
      setTesting(false);
    }
  };

  const loadLogs = async () => {
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      const response = await fetch(`${API_URL}/api/smtp/logs${selectedSmtp?.id ? `?smtpId=${selectedSmtp.id}` : ''}`, {
        headers: {
          ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
        },
      });

      if (!response.ok) throw new Error('Failed to load logs');

      const result = await response.json();
      if (result.success && result.data) {
        setLogs(result.data);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const handleViewLogs = () => {
    setShowLogs(!showLogs);
    if (!showLogs) {
      loadLogs();
    }
  };

  const updateFormField = (key: keyof SmtpSettings, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Custom refresh handler that only refreshes SMTP data without reloading the page
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadSmtpSettings();
      if (selectedSmtp?.id) {
        await loadLogs();
      }
    } catch (error) {
      console.error('Error refreshing email settings:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SkyberSecutity>
      <DashboardThemeProvider>
        <div className="flex min-h-screen bg-background">
          <SuperAdminSidebar />
          <main className="w-full">
            <DashboardHeader
              title="Integrations"
              subtitle="Manage your third-party integrations and services"
              onRefresh={handleRefresh}
              refreshing={refreshing}
            />
            <DashboardBody>
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Code className="h-6 w-6" />
                    Integrations
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Connect and configure third-party services for your platform
                  </p>
                </div>

                {/* Email Setup Section - Collapsible */}
                <Card>
                  <CardHeader>
                    <button
                      onClick={() => setEmailSectionExpanded(!emailSectionExpanded)}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Setup (SMTP)
                      </CardTitle>
                      {emailSectionExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                  </CardHeader>
                  {emailSectionExpanded && (
                    <CardContent className="space-y-6">
                      <p className="text-sm text-muted-foreground">
                        Configure your SMTP settings to send emails from your account
                      </p>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {!isEditing ? (
                          <>
                            <Button onClick={handleEdit} variant="outline">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            {selectedSmtp?.id && (
                              <Button onClick={handleTestConnection} variant="outline" disabled={testing}>
                                <TestTube className="h-4 w-4 mr-2" />
                                {testing ? 'Testing...' : 'Test Connection'}
                              </Button>
                            )}
                            <Button onClick={handleViewLogs} variant="outline">
                              <History className="h-4 w-4 mr-2" />
                              {showLogs ? 'Hide' : 'View'} Logs
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button onClick={handleCancel} variant="outline">
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={loading}>
                              <Save className="h-4 w-4 mr-2" />
                              {loading ? 'Saving...' : 'Save'}
                            </Button>
                          </>
                        )}
                      </div>

                      {/* Provider Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="provider">SMTP Provider</Label>
                        <Select
                          value={formData.provider}
                          onValueChange={(value) => updateFormField('provider', value)}
                          disabled={!isEditing}
                        >
                          <SelectTrigger id="provider">
                            <SelectValue placeholder="Select SMTP provider" />
                          </SelectTrigger>
                          <SelectContent>
                            {SMTP_PROVIDERS.map((provider) => (
                              <SelectItem key={provider.value} value={provider.value}>
                                {provider.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* SMTP Server */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="host">SMTP Server</Label>
                          <Input
                            id="host"
                            value={formData.host}
                            onChange={(e) => updateFormField('host', e.target.value)}
                            disabled={!isEditing}
                            placeholder="smtp.example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="port">Port</Label>
                          <Input
                            id="port"
                            type="number"
                            value={formData.port}
                            onChange={(e) => updateFormField('port', parseInt(e.target.value) || 587)}
                            disabled={!isEditing}
                            placeholder="587"
                          />
                        </div>
                      </div>

                      {/* Security */}
                      <div className="space-y-2">
                        <Label htmlFor="secure">Security</Label>
                        <Select
                          value={formData.secure ? 'true' : 'false'}
                          onValueChange={(value) => updateFormField('secure', value === 'true')}
                          disabled={!isEditing}
                        >
                          <SelectTrigger id="secure">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="false">TLS (Recommended)</SelectItem>
                            <SelectItem value="true">SSL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Credentials */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">SMTP Username/Login</Label>
                          <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => updateFormField('username', e.target.value)}
                            disabled={!isEditing}
                            placeholder="your-email@example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">SMTP Password/Key</Label>
                          <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => updateFormField('password', e.target.value)}
                            disabled={!isEditing}
                            placeholder={isEditing ? "Enter SMTP password or API key" : "••••••••"}
                          />
                        </div>
                      </div>

                      {/* Email Configuration */}
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold">Email Configuration</h3>
                        <div className="space-y-2">
                          <Label htmlFor="fromName">From Name</Label>
                          <Input
                            id="fromName"
                            value={formData.fromName}
                            onChange={(e) => updateFormField('fromName', e.target.value)}
                            disabled={!isEditing}
                            placeholder="SKYBER TECHNOLOGIES"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fromEmail">From Email</Label>
                            <Input
                              id="fromEmail"
                              type="email"
                              value={formData.fromEmail}
                              onChange={(e) => updateFormField('fromEmail', e.target.value)}
                              disabled={!isEditing}
                              placeholder="informer@skyber.dev"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="toEmail">Default To Email</Label>
                            <Input
                              id="toEmail"
                              type="email"
                              value={formData.toEmail}
                              onChange={(e) => updateFormField('toEmail', e.target.value)}
                              disabled={!isEditing}
                              placeholder={user?.email || "recipient@example.com"}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      {selectedSmtp?.id && !isEditing && (
                        <div className="space-y-2 border-t pt-4">
                          <h3 className="font-semibold">Status</h3>
                          <div className="flex items-center gap-4">
                            {selectedSmtp.lastTestStatus && (
                              <div className="flex items-center gap-2">
                                {selectedSmtp.lastTestStatus === 'success' ? (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-green-500">Last test: Success</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    <span className="text-sm text-red-500">Last test: Failed</span>
                                  </>
                                )}
                                {selectedSmtp.lastTestAt && (
                                  <span className="text-xs text-muted-foreground">
                                    ({new Date(selectedSmtp.lastTestAt).toLocaleString()})
                                  </span>
                                )}
                              </div>
                            )}
                            {selectedSmtp.isDefault && (
                              <Badge variant="default">Default</Badge>
                            )}
                            {selectedSmtp.isActive ? (
                              <Badge variant="default">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </div>
                          {selectedSmtp.lastTestError && (
                            <p className="text-sm text-red-500 mt-2">
                              Error: {selectedSmtp.lastTestError}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Logs Section */}
                      {showLogs && (
                        <div className="border-t pt-4 space-y-4">
                          <h3 className="font-semibold">SMTP Activity Logs</h3>
                          {logs.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">No logs available</p>
                          ) : (
                            <div className="space-y-4">
                              {logs.map((log) => (
                                <div key={log.id} className="border rounded-lg p-4 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline">{log.action}</Badge>
                                      <span className="text-sm text-muted-foreground">
                                        {new Date(log.timestamp).toLocaleString()}
                                      </span>
                                    </div>
                                    {log.testStatus && (
                                      <div className="flex items-center gap-2">
                                        {log.testStatus === 'success' ? (
                                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                          <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className="text-sm">{log.testStatus}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-sm space-y-1">
                                    <p><strong>Provider:</strong> {log.settings.provider}</p>
                                    <p><strong>Host:</strong> {log.settings.host}:{log.settings.port}</p>
                                    <p><strong>From:</strong> {log.settings.fromName} &lt;{log.settings.fromEmail}&gt;</p>
                                    {log.testError && (
                                      <p className="text-red-500"><strong>Error:</strong> {log.testError}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>

                {/* Placeholder for future integrations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      More Integrations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      Additional integrations will be available here in future updates.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </DashboardBody>
          </main>
        </div>
      </DashboardThemeProvider>
    </SkyberSecutity>
  );
}

