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
      switch (status) {
        case "PUBLISHED":
          return <Badge variant="default" className="bg-green-500 hover:bg-green-600 border-0">{t("manage_games.status_published") || "Published"}</Badge>;
        case "COMING_SOON":
          return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-0">{t("manage_games.status_coming_soon") || "Coming Soon"}</Badge>;
        case "MAINTENANCE":
          return <Badge variant="destructive">{t("manage_games.status_maintenance") || "Maintenance"}</Badge>;
        case "DRAFT":
        default:
          return <Badge variant="outline" className="text-muted-foreground">{t("manage_games.status_draft") || "Draft"}</Badge>;
      }
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
