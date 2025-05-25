import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from 'lucide-react';

const AdminSecurity = () => {
  const [users, setUsers] = useState([
    { id: 1, username: "admin1", role: "Administrator", twoFactorEnabled: true },
    { id: 2, username: "user1", role: "User", twoFactorEnabled: false },
  ]);

  const [passwordPolicy, setPasswordPolicy] = useState({
    isEditing: false,
    rules: [
      "Minimum 8 characters",
      "At least one uppercase letter",
      "At least one lowercase letter",
      "At least one number",
      "At least one special character"
    ]
  });

  const [auditLogs, setAuditLogs] = useState({
    isEditing: false,
    logs: [
      "User \"admin1\" logged in",
      "User \"user1\" changed password",
      "User \"admin1\" enabled 2FA"
    ]
  });

  const handleToggleTwoFactor = (userId) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, twoFactorEnabled: !user.twoFactorEnabled } : user
    ));
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleEditPasswordPolicy = () => {
    setPasswordPolicy(prev => ({ ...prev, isEditing: !prev.isEditing }));
  };

  const handleEditAuditLogs = () => {
    setAuditLogs(prev => ({ ...prev, isEditing: !prev.isEditing }));
  };

  const handleUpdatePasswordPolicy = (index, value) => {
    setPasswordPolicy(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => i === index ? value : rule)
    }));
  };

  const handleUpdateAuditLog = (index, value) => {
    setAuditLogs(prev => ({
      ...prev,
      logs: prev.logs.map((log, i) => i === index ? value : log)
    }));
  };

  const handleAddPasswordRule = () => {
    setPasswordPolicy(prev => ({
      ...prev,
      rules: [...prev.rules, "New password rule"]
    }));
  };

  const handleAddAuditLog = () => {
    setAuditLogs(prev => ({
      ...prev,
      logs: [...prev.logs, "New audit log entry"]
    }));
  };

  const handleRemovePasswordRule = (index) => {
    setPasswordPolicy(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const handleRemoveAuditLog = (index) => {
    setAuditLogs(prev => ({
      ...prev,
      logs: prev.logs.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="mx-auto max-w-6xl">
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {/* User Management Section */}
          <h2 className="text-lg font-semibold mb-4">User Management</h2>
          <div className="space-y-2">
            {users.map(user => (
              <div key={user.id} className="flex justify-between items-center border-b py-2">
                <div>
                  <strong>{user.username}</strong> - {user.role}
                  {user.twoFactorEnabled ? (
                    <span className="text-green-600 ml-2">2FA Enabled</span>
                  ) : (
                    <span className="text-red-600 ml-2">2FA Disabled</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={() => handleToggleTwoFactor(user.id)}>
                    Toggle 2FA
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                    Delete User
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Password Policy Section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Password Policy</h2>
              <div className="flex gap-2">
                {passwordPolicy.isEditing && (
                  <Button 
                    size="icon"
                    variant="outline" 
                    onClick={handleAddPasswordRule}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={handleEditPasswordPolicy}
                >
                  {passwordPolicy.isEditing ? 'Save Changes' : 'Edit Policy'}
                </Button>
              </div>
            </div>
            <div className="mb-4">
              <p>Ensure strong password policies are enforced:</p>
              <ul className="list-disc ml-5 space-y-2">
                {passwordPolicy.rules.map((rule, index) => (
                  <li key={index} className="flex items-center gap-2">
                    {passwordPolicy.isEditing ? (
                      <>
                        <Input
                          value={rule}
                          onChange={(e) => handleUpdatePasswordPolicy(index, e.target.value)}
                          className="mt-1"
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemovePasswordRule(index)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSecurity;