import { DashboardHeader } from "@/app/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <DashboardHeader heading="Settings" text="Configure your application preferences" />
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>Customize your rental management experience</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Settings content will go here</p>
        </CardContent>
      </Card>
    </div>
  )
}

