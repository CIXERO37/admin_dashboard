"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Key, Smartphone, Clock } from "lucide-react"

export default function SettingsSecurityPage() {
  const loginHistory = [
    { device: "Chrome on Windows", location: "New York, US", time: "2 hours ago", current: true },
    { device: "Safari on iPhone", location: "New York, US", time: "1 day ago", current: false },
    { device: "Firefox on macOS", location: "Los Angeles, US", time: "3 days ago", current: false },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Security Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account security and authentication</p>
      </div>

      <div className="grid gap-6">
        {/* Password */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Key className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-foreground">
                Current Password
              </Label>
              <Input id="currentPassword" type="password" className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-foreground">
                New Password
              </Label>
              <Input id="newPassword" type="password" className="bg-background border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm New Password
              </Label>
              <Input id="confirmPassword" type="password" className="bg-background border-border" />
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Smartphone className="h-5 w-5" />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>Add an extra layer of security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-10 w-10 text-[var(--success)]" />
                <div>
                  <p className="font-medium text-foreground">2FA is enabled</p>
                  <p className="text-sm text-muted-foreground">
                    Your account is protected with two-factor authentication
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Login History */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Clock className="h-5 w-5" />
              Login History
            </CardTitle>
            <CardDescription>Recent login activity on your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loginHistory.map((login, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{login.device}</p>
                      {login.current && (
                        <Badge className="bg-[var(--success)]/20 text-[var(--success)] border-[var(--success)]/30">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {login.location} • {login.time}
                    </p>
                  </div>
                  {!login.current && (
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
