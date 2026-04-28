"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/shared/search-input";
import { DataTable } from "@/components/dashboard/data-table";
import { useTranslation } from "@/lib/i18n";
import { blogsService } from "@/lib/services/blogs-service";
import { BlogCategory } from "@/types/blog";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BlogCategoryClient() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await blogsService.getCategories();
      setCategories(data);
    } catch (error: any) {
      toast.error(error.message || t("blog_category.error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Auto generate slug
  useEffect(() => {
    if (!editingCategory) {
      setFormSlug(
        formName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .trim()
      );
    }
  }, [formName, editingCategory]);

  const handleOpenDialog = (category?: BlogCategory) => {
    if (category) {
      setEditingCategory(category);
      setFormName(category.name);
      setFormSlug(category.slug);
    } else {
      setEditingCategory(null);
      setFormName("");
      setFormSlug("");
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formName.trim() || !formSlug.trim()) {
      toast.error("Name and Slug are required");
      return;
    }

    try {
      setIsSaving(true);
      if (editingCategory) {
        await blogsService.updateCategory(editingCategory.id, {
          name: formName,
          slug: formSlug,
        });
        toast.success(t("blog_category.save_success") || "Category updated");
      } else {
        await blogsService.createCategory({ name: formName, slug: formSlug });
        toast.success(t("blog_category.save_success") || "Category created");
      }
      setIsDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || t("blog_category.error"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setIsSaving(true);
      await blogsService.deleteCategory(deletingId);
      toast.success(t("blog_category.delete_success") || "Category deleted");
      setIsDeleteDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message || t("blog_category.error"));
    } finally {
      setIsSaving(false);
      setDeletingId(null);
    }
  };

  // Filter and paginate
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedData = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns = [
    { key: "name", label: t("blog_category.name") || "Name" },
    { key: "slug", label: t("blog_category.slug") || "Slug" },
    {
      key: "actions",
      label: t("table.actions") || "Actions",
      align: "right" as const,
      render: (val: any, row: any) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenDialog(row as BlogCategory)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              setDeletingId(row.id);
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {t("nav.blog_category") || "Blog Categories"}
        </h1>
        <div className="flex items-center gap-3">
          <SearchInput
            placeholder={t("action.search") || "Search..."}
            className="w-64 bg-background border-border text-sm h-9"
            value={searchQuery}
            onSearch={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
          />
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            {t("action.add") || "Add"}
          </Button>
        </div>
      </div>

      <div className={isLoading ? "opacity-60 pointer-events-none" : ""}>
        <DataTable
          columns={columns}
          data={paginatedData as unknown as Record<string, unknown>[]}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory
                ? t("blog_category.edit") || "Edit Category"
                : t("blog_category.add") || "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t("blog_category.name") || "Name"}</Label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Technology"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("blog_category.slug") || "Slug"}</Label>
              <Input
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="e.g. technology"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
            >
              {t("action.cancel") || "Cancel"}
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("action.save") || "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("action.delete") || "Delete"}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("blog_category.delete_confirm") ||
                "Are you sure you want to delete this category?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSaving}>
              {t("action.cancel") || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("action.delete") || "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
