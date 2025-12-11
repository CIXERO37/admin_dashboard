import { notFound } from "next/navigation"
import { format } from "date-fns"

import { fetchProfileById } from "../actions"
import { Badge } from "@/components/ui/badge"
import { AvatarDialog, MapDialog, BackButton } from "./profile-client"

interface PageProps {
  params: Promise<{ id: string }>
}

const statusColors: Record<string, string> = {
  Active: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  Blocked: "bg-red-500/20 text-red-500 border-red-500/30",
}

const roleColors: Record<string, string> = {
  admin: "bg-purple-500/20 text-purple-500 border-purple-500/30",
  user: "bg-gray-500/20 text-gray-500 border-gray-500/30",
}

export default async function ProfileDetailPage({ params }: PageProps) {
  const { id } = await params
  const { data: profile, error } = await fetchProfileById(id)

  if (error || !profile) {
    notFound()
  }

  const status = profile.is_blocked ? "Blocked" : "Active"
  const role = profile.role ?? "user"

  return (
    <div className="space-y-2 -mt-4">
      <BackButton />
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 pt-4 pb-6 space-y-6">
          <div className="flex items-center gap-4">
            <AvatarDialog avatarUrl={profile.avatar_url} fullname={profile.fullname} />
            <div>
              <h2 className="text-2xl font-semibold text-foreground">{profile.fullname ?? "-"}</h2>
              <p className="text-sm text-muted-foreground">@{profile.username ?? "-"}</p>
            </div>
            <div className="flex items-center gap-6 ml-6 pl-6 border-l border-border">
              <div className="text-center">
                <p className="text-xl font-semibold text-foreground">{profile.following_count ?? 0}</p>
                <p className="text-xs text-muted-foreground">Following</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-foreground">{profile.followers_count ?? 0}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-foreground">{profile.friends_count ?? 0}</p>
                <p className="text-xs text-muted-foreground">Friends</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-foreground font-medium">{profile.email ?? "-"}</p>
            </div>
            {profile.organization && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Organization</p>
                <p className="text-foreground font-medium">{profile.organization}</p>
              </div>
            )}
            {profile.birthdate && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="text-foreground font-medium">
                  {Math.floor((Date.now() - new Date(profile.birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} tahun
                </p>
              </div>
            )}
            {profile.phone && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="text-foreground font-medium">{profile.phone}</p>
              </div>
            )}
            {profile.address && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-foreground font-medium">{profile.address}</p>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Role</p>
              <Badge variant="outline" className={roleColors[role] ?? "bg-secondary text-secondary-foreground"}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="outline" className={statusColors[status] ?? "bg-secondary text-secondary-foreground"}>
                {status}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Last Active</p>
              <p className="text-foreground font-medium">
                {profile.last_active ? format(new Date(profile.last_active), "dd MMM yyyy, HH:mm") : "-"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {(profile.city?.latitude || profile.state?.latitude || profile.country?.latitude) && (() => {
        const lat = profile.city?.latitude ?? profile.state?.latitude ?? profile.country?.latitude ?? 0
        const lng = profile.city?.longitude ?? profile.state?.longitude ?? profile.country?.longitude ?? 0
        const locationName = [profile.city?.name, profile.state?.name, profile.country?.name].filter(Boolean).join(", ")
        
        return (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Location</h3>
              <MapDialog latitude={lat} longitude={lng} locationName={locationName} />
            </div>
            <div className="h-[400px] relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[calc(50%+40px)] z-10 pointer-events-none">
                <div className="bg-card/95 backdrop-blur-sm rounded-lg px-4 py-2 border border-border shadow-lg">
                  <p className="text-sm font-medium text-foreground whitespace-nowrap">{locationName}</p>
                </div>
              </div>
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.5}%2C${lat - 0.5}%2C${lng + 0.5}%2C${lat + 0.5}&layer=mapnik&marker=${lat}%2C${lng}`}
              />
            </div>
          </div>
        )
      })()}
    </div>
  )
}
