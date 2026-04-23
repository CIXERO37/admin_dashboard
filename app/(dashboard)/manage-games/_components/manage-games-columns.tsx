import { MasterGame } from "@/types/master-game";
import { Image as ImageIcon, Trash2, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getManageGameColumns = (
  t: any,
  onPreviewImage: (url: string, title: string) => void,
  onDeleteInitiate: (item: MasterGame) => void
) => [
  {
    key: "image",
    label: t("manage_games.table_cover") || "Cover",
    render: (value: unknown, row: Record<string, unknown>) => {
      const imageUrl = value as string | null;
      const title = row.title as string;
      return (
        <div
          className={`h-10 w-14 rounded overflow-hidden bg-muted flex items-center justify-center border shrink-0 ${
            imageUrl ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (imageUrl) onPreviewImage(imageUrl, title);
          }}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
          )}
        </div>
      );
    },
  },
  {
    key: "title",
    label: t("manage_games.table_title") || "Title",
    render: (value: unknown) => (
      <span className="font-medium truncate block max-w-[200px]" title={value as string}>
        {value as string}
      </span>
    ),
  },
  {
    key: "application",
    label: t("manage_games.table_application") || "Application",
    render: (value: unknown) => (
      <Badge variant="outline" className="font-mono text-xs capitalize">
        {(value as string) || "—"}
      </Badge>
    ),
  },
  {
    key: "genre",
    label: t("manage_games.table_genre") || "Genre",
    render: (value: unknown) => {
      const genre = value as string;
      return genre ? <Badge variant="secondary" className="capitalize">{genre}</Badge> : "—";
    },
  },
  {
    key: "status",
    label: t("manage_games.table_status") || "Status",
    render: (value: unknown) => {
      const status = (value as string) || "DRAFT";
      const statusConfig: Record<string, { label: string; className: string }> = {
        PUBLISHED: {
          label: t("manage_games.status_published") || "Published",
          className: "bg-emerald-500/15 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800",
        },
        COMING_SOON: {
          label: t("manage_games.status_coming_soon") || "Coming Soon",
          className: "bg-orange-500/15 text-orange-600 border-orange-200 dark:text-orange-400 dark:border-orange-800",
        },
        MAINTENANCE: {
          label: t("manage_games.status_maintenance") || "Maintenance",
          className: "bg-red-500/15 text-red-600 border-red-200 dark:text-red-400 dark:border-red-800",
        },
        DRAFT: {
          label: t("manage_games.status_draft") || "Draft",
          className: "bg-gray-500/15 text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700",
        },
      };
      const cfg = statusConfig[status] || statusConfig.DRAFT;
      return (
        <Badge variant="outline" className={`capitalize border ${cfg.className}`}>
          {cfg.label}
        </Badge>
      );
    },
  },
  {
    key: "played_count",
    label: t("manage_games.table_played") || "Played",
    render: (value: unknown) => (
      <span className="text-muted-foreground">
        {((value as number) || 0).toLocaleString("id-ID")}
      </span>
    ),
  },
  {
    key: "is_favorite",
    label: t("manage_games.table_favorite") || "Favorite",
    render: (value: unknown) => {
      const isFav = value as boolean;
      return isFav ? (
        <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 shadow-none border-0">
          ⭐ {t("manage_games.favorite") || "Favorite"}
        </Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    key: "actions",
    label: t("table.actions") || "Actions",
    align: "center" as const,
    render: (value: unknown, row: Record<string, unknown>) => (
      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteInitiate(row as unknown as MasterGame);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("action.delete") || "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
