import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Image as ImageIcon, Trash2 } from "lucide-react";
import { Blog } from "@/types/blog";
import { TimeAgo } from "@/components/shared/time-ago";

export const getManageBlogColumns = (
  t: any,
  onPreviewCover: (url: string, title: string) => void,
  onDeleteInitiate: (item: Blog) => void
) => [
  {
    key: "image",
    label: t("manage_blog.table_cover") || "Cover",
    render: (value: unknown, row: Record<string, unknown>) => {
      const imageUrl = value as string | null;
      const title = row.title as string;
      return (
        <div
          className={`h-10 w-16 rounded overflow-hidden bg-muted flex items-center justify-center border shrink-0 ${
            imageUrl
              ? "cursor-pointer hover:opacity-80 transition-opacity"
              : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (imageUrl) onPreviewCover(imageUrl, title);
          }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageIcon className="h-4 w-4 text-muted-foreground/30" />
          )}
        </div>
      );
    },
  },
  {
    key: "title",
    label: t("manage_blog.table_title") || "Title",
    render: (value: unknown) => (
      <span
        className="font-medium truncate block max-w-[250px]"
        title={value as string}
      >
        {value as string}
      </span>
    ),
  },
  {
    key: "author",
    label: t("manage_blog.table_author") || "Author",
    render: (value: unknown) => (
      <span className="text-muted-foreground text-sm">{value as string}</span>
    ),
  },
  {
    key: "category",
    label: t("manage_blog.table_category") || "Category",
    render: (value: unknown) => {
      const categories = value as string[];
      if (!categories || categories.length === 0)
        return <span className="text-muted-foreground">&mdash;</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {categories.slice(0, 2).map((cat, i) => (
            <Badge key={i} variant="secondary" className="capitalize text-xs">
              {cat.toLowerCase()}
            </Badge>
          ))}
          {categories.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{categories.length - 2}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    key: "status",
    label: t("manage_blog.table_status") || "Status",
    render: (value: unknown) => {
      const status = (value as string) || "DRAFT";
      const statusConfig: Record<
        string,
        { label: string; className: string }
      > = {
        PUBLISHED: {
          label: t("manage_blog.status_published") || "Published",
          className:
            "bg-emerald-500/15 text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800",
        },
        DRAFT: {
          label: t("manage_blog.status_draft") || "Draft",
          className:
            "bg-gray-500/15 text-gray-500 border-gray-200 dark:text-gray-400 dark:border-gray-700",
        },
      };
      const cfg = statusConfig[status] || statusConfig.DRAFT;
      return (
        <Badge
          variant="outline"
          className={`capitalize border ${cfg.className}`}
        >
          {cfg.label}
        </Badge>
      );
    },
  },
  {
    key: "created_at",
    label: t("manage_blog.table_date") || "Date",
    render: (value: unknown) => {
      const dateStr = value as string;
      if (!dateStr) return "-";
      return <TimeAgo date={dateStr} />;
    },
  },
  {
    key: "actions",
    label: t("manage_blog.table_actions") || "Actions",
    render: (value: unknown, row: Record<string, unknown>) => (
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
              onDeleteInitiate(row as unknown as Blog);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("action.delete") || "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
