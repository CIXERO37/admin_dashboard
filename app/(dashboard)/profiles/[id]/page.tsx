import { notFound } from "next/navigation"
import { format } from "date-fns"

import { fetchProfileById } from "../actions"
import { Badge } from "@/components/ui/badge"
import { AvatarDialog, ProfileBreadcrumb } from "./profile-client"

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
    <div className="space-y-4">
      {/* Header with Breadcrumb */}
      <div className="space-y-2">
        <ProfileBreadcrumb name={profile.fullname || profile.username || "Unknown"} />
        <h1 className="text-3xl font-bold text-foreground">Profile Detail</h1>
      </div>

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
            {(profile.country || profile.state || profile.city) && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-foreground font-medium">
                  {[profile.city?.name?.replace(/^Kabupaten\s+/i, "Kab. "), profile.state?.name, profile.country?.name].filter(Boolean).join(", ") || "-"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  )
}
