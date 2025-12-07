"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"

export default function SettingsGeneralPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">General Settings</h1>
        <p className="mt-1 text-muted-foreground">Configure general system options</p>
      </div>

      <div className="grid gap-6">
        {/* App Settings */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Application Settings</CardTitle>
            <CardDescription>Configure your application preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="appName" className="text-foreground">
                  Application Name
                </Label>
                <Input id="appName" defaultValue="Gameforsmart" className="bg-background border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-foreground">
                  Timezone
                </Label>
                <Select defaultValue="utc">
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time (EST)</SelectItem>
                    <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    <SelectItem value="wib">Western Indonesia (WIB)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="language" className="text-foreground">
                  Language
                </Label>
                <Select defaultValue="en">
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="id">Indonesian</SelectItem>
                    <SelectItem value="jp">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-foreground">
                  Currency
                </Label>
                <Select defaultValue="usd">
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                    <SelectItem value="idr">IDR (Rp)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Notification Settings</CardTitle>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Weekly Reports</p>
                <p className="text-sm text-muted-foreground">Receive weekly summary reports via email</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Button className="w-fit">
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  )
}
