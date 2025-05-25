import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch.jsx";
import { Settings, Mail, Globe, Clock, Bell, Shield, Palette } from 'lucide-react';

const AdminGeneralSettings = () => {
  // Website Settings
  const [websiteSettings, setWebsiteSettings] = useState({
    siteName: 'Medical Clinic',
    siteDescription: 'Your trusted healthcare partner',
    contactEmail: 'contact@medicalclinic.com',
    contactPhone: '+1 234 567 890',
    address: '123 Healthcare Ave, Medical City, MC 12345'
  });

  // Appointment Settings
  const [appointmentSettings, setAppointmentSettings] = useState({
    defaultAppointmentDuration: 30,
    minAdvanceBooking: 24,
    maxAdvanceBooking: 30,
    allowCancellation: true,
    cancellationWindow: 12,
    sendReminders: true,
    reminderHours: 24
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    appointmentReminders: true,
    marketingEmails: false,
    adminNotifications: true
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    requireEmailVerification: true,
    twoFactorAuth: false,
    passwordExpiry: 90,
    sessionTimeout: 30,
    maxLoginAttempts: 5
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: '#4CAF50',
    accentColor: '#2196F3',
    showLogo: true,
    compactView: false
  });

  const handleSave = (section) => {
    // Here you would typically make an API call to save the settings
    console.log(`Saving ${section} settings...`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            <CardTitle>General Settings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="website" className="space-y-4">
            <TabsList>
              <TabsTrigger value="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
            </TabsList>

            {/* Website Settings */}
            <TabsContent value="website" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={websiteSettings.siteName}
                    onChange={(e) => setWebsiteSettings({
                      ...websiteSettings,
                      siteName: e.target.value
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input
                    id="siteDescription"
                    value={websiteSettings.siteDescription}
                    onChange={(e) => setWebsiteSettings({
                      ...websiteSettings,
                      siteDescription: e.target.value
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={websiteSettings.contactEmail}
                    onChange={(e) => setWebsiteSettings({
                      ...websiteSettings,
                      contactEmail: e.target.value
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactphone">Contact Number</Label>
                  <Input
                    id="contactphone"
                    type="email"
                    value={websiteSettings.contactPhone}
                    onChange={(e) => setWebsiteSettings({
                      ...websiteSettings,
                      contactPhone: e.target.value
                    })}
                  />
                </div>
                <Button onClick={() => handleSave('website')}>Save Website Settings</Button>
              </div>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: checked
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <Switch
                    id="smsNotifications"
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({
                      ...notificationSettings,
                      smsNotifications: checked
                    })}
                  />
                </div>
                <Button onClick={() => handleSave('notifications')}>Save Notification Settings</Button>
              </div>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                  <Switch
                    id="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({
                      ...securitySettings,
                      twoFactorAuth: checked
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => setSecuritySettings({
                      ...securitySettings,
                      passwordExpiry: parseInt(e.target.value)
                    })}
                  />
                </div>
                <Button onClick={() => handleSave('security')}>Save Security Settings</Button>
              </div>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="theme">Theme</Label>
                  <select
                    id="theme"
                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                    value={appearanceSettings.theme}
                    onChange={(e) => setAppearanceSettings({
                      ...appearanceSettings,
                      theme: e.target.value
                    })}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="compactView">Compact View</Label>
                  <Switch
                    id="compactView"
                    checked={appearanceSettings.compactView}
                    onCheckedChange={(checked) => setAppearanceSettings({
                      ...appearanceSettings,
                      compactView: checked
                    })}
                  />
                </div>
                <Button onClick={() => handleSave('appearance')}>Save Appearance Settings</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGeneralSettings;