"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/src/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import { useTranslation } from "@/lib/i18n";

export function StatusList({ lists }: { lists: any }) {
  const { locale } = useTranslation();
  const router = useRouter();
  const [previewPoster, setPreviewPoster] = useState<{ url: string; title: string } | null>(null);

  const renderList = (items: any[], emptyMsg: string) => {
    if (!items || items.length === 0) {
      return (
        <div className="flex items-center justify-center p-8 text-muted-foreground text-sm border rounded-lg bg-muted/10">
          {emptyMsg}
        </div>
      );
    }

    return (
      <div className="rounded-md border bg-card text-card-foreground">
        {items.map((comp, idx) => {
          let statusColor = "bg-gray-500/10 text-gray-500 border-gray-500/20";
          if (comp.status === "published") statusColor = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
          if (comp.status === "draft") statusColor = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";

          return (
            <div 
              key={comp.id} 
              className={`flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer ${idx !== items.length - 1 ? 'border-b' : ''}`}
              onClick={() => router.push(`/manage-competitions/${comp.id}`)}
            >
              <div className="flex items-center gap-4">
                {/* Poster Thumbnail */}
                <div
                  className={`h-12 w-16 rounded overflow-hidden bg-muted flex items-center justify-center border shrink-0 ${
                    comp.poster_url ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (comp.poster_url) setPreviewPoster({ url: comp.poster_url, title: comp.title });
                  }}
                >
                  {comp.poster_url ? (
                    <img src={comp.poster_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-muted-foreground/30" />
                  )}
                </div>

                <div className="space-y-1">
                  <p className="font-medium text-sm">{comp.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className={`capitalize text-[10px] h-5 ${statusColor}`}>
                      {comp.status}
                    </Badge>
                    {comp.category && <span>• {comp.category}</span>}
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-right text-muted-foreground shrink-0 ml-4">
                <span className="block mb-1">
                  {locale === "id" ? "Mulai" : "Start"}: {comp.registration_start_date ? format(new Date(comp.registration_start_date), "MMM d, yyyy") : (locale === "id" ? "Belum ditentukan" : 'TBA')}
                </span>
                <span>
                  {locale === "id" ? "Selesai" : "End"}: {comp.final_end_date ? format(new Date(comp.final_end_date), "MMM d, yyyy") : 
                   comp.registration_end_date ? format(new Date(comp.registration_end_date), "MMM d, yyyy") : (locale === "id" ? "Belum ditentukan" : 'TBA')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4 text-foreground">{locale === "id" ? "Kompetisi Berdasarkan Jadwal" : "Competitions by Schedule"}</h3>
      <Tabs defaultValue="ongoing" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="ongoing">{locale === "id" ? "Berlangsung" : "Ongoing"} ({lists?.ongoing?.length || 0})</TabsTrigger>
          <TabsTrigger value="comingSoon">{locale === "id" ? "Akan Datang" : "Coming Soon"} ({lists?.comingSoon?.length || 0})</TabsTrigger>
          <TabsTrigger value="completed">{locale === "id" ? "Selesai" : "Completed"} ({lists?.completed?.length || 0})</TabsTrigger>
        </TabsList>
        <TabsContent value="ongoing" className="mt-0">
          {renderList(lists?.ongoing, locale === "id" ? "Tidak ada kompetisi yang sedang berlangsung saat ini." : "No ongoing competitions at the moment.")}
        </TabsContent>
        <TabsContent value="comingSoon" className="mt-0">
          {renderList(lists?.comingSoon, locale === "id" ? "Tidak ada kompetisi yang akan datang." : "No upcoming competitions.")}
        </TabsContent>
        <TabsContent value="completed" className="mt-0">
          {renderList(lists?.completed, locale === "id" ? "Belum ada kompetisi yang selesai." : "No completed competitions yet.")}
        </TabsContent>
      </Tabs>

      {/* Poster Preview Dialog */}
      <Dialog
        open={!!previewPoster}
        onOpenChange={() => setPreviewPoster(null)}
      >
        <DialogContent className="max-w-lg p-2">
          <DialogTitle className="sr-only">{locale === "id" ? "Pratinjau Poster" : "Poster Preview"}</DialogTitle>
          {previewPoster && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium px-2 pt-2">
                {previewPoster.title}
              </p>
              <img
                src={previewPoster.url}
                alt={previewPoster.title}
                className="w-full rounded-md object-contain max-h-[70vh]"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
