"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X, ChevronRight, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigationGuard } from "@/contexts/navigation-guard";
import { BlogCategory } from "@/types/blog";
import { blogsService } from "@/lib/services/blogs-service";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface ManageBlogFormProps {
  initialData?: any;
  blogId?: string;
}

export function ManageBlogForm({ initialData, blogId }: ManageBlogFormProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const { setDirty } = useNavigationGuard();

  // Form state
  const [formTitle, setFormTitle] = useState(initialData?.title || "");
  const [formSlug, setFormSlug] = useState(initialData?.slug || "");
  const [formAuthor, setFormAuthor] = useState(initialData?.author || "");
  const [formDate, setFormDate] = useState(initialData?.date || "");
  const [formExcerpt, setFormExcerpt] = useState(initialData?.excerpt || "");
  const [formContent, setFormContent] = useState(initialData?.content || "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialData?.category || []
  );
  const [status, setStatus] = useState(initialData?.status || "DRAFT");

  // File upload
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialData?.image || null
  );

  // Categories from database
  const [categories, setCategories] = useState<BlogCategory[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  // Load categories
  useEffect(() => {
    blogsService.getCategories().then(setCategories).catch(console.error);
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (!blogId) {
      const slug = formTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setFormSlug(slug);
    }
  }, [formTitle, blogId]);

  // --- Dirty Tracking ---
  const initialSnapshot = useRef({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    author: initialData?.author || "",
    date: initialData?.date || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    category: JSON.stringify(initialData?.category || []),
    status: initialData?.status || "DRAFT",
  });

  const isDirty = useMemo(() => {
    const snap = initialSnapshot.current;
    return (
      formTitle !== snap.title ||
      formSlug !== snap.slug ||
      formAuthor !== snap.author ||
      formDate !== snap.date ||
      formExcerpt !== snap.excerpt ||
      formContent !== snap.content ||
      JSON.stringify(selectedCategories) !== snap.category ||
      status !== snap.status ||
      coverFile !== null
    );
  }, [
    formTitle,
    formSlug,
    formAuthor,
    formDate,
    formExcerpt,
    formContent,
    selectedCategories,
    status,
    coverFile,
  ]);

  // Sync dirty state with global navigation guard
  useEffect(() => {
    setDirty(isDirty && !isSaving);
  }, [isDirty, isSaving, setDirty]);

  // --- Image handling ---
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverFile(file);
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Category toggling ---
  const toggleCategory = (catName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catName)
        ? prev.filter((c) => c !== catName)
        : [...prev, catName]
    );
  };

  // --- Save ---
  const handleSave = async () => {
    if (!formTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formAuthor.trim()) {
      toast.error("Author is required");
      return;
    }
    if (!formSlug.trim()) {
      toast.error("Slug is required");
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = initialData?.image || null;

      // Upload cover image if changed
      if (coverFile) {
        const ext = coverFile.name.split(".").pop();
        const filePath = `blog-covers/${formSlug}-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("blog-images")
          .upload(filePath, coverFile, { upsert: true });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("blog-images").getPublicUrl(filePath);
        imageUrl = publicUrl;
      }

      const blogData = {
        slug: formSlug,
        title: formTitle,
        author: formAuthor,
        date: formDate || null,
        category: selectedCategories,
        excerpt: formExcerpt || null,
        content: formContent || null,
        image: imageUrl,
        status,
        published_at: status === "PUBLISHED" ? new Date().toISOString() : null,
      };

      if (blogId) {
        // Update
        const { error } = await supabase
          .from("blogs")
          .update({ ...blogData, updated_at: new Date().toISOString() })
          .eq("id", blogId);
        if (error) throw error;

        // Reset snapshot
        initialSnapshot.current = {
          title: formTitle,
          slug: formSlug,
          author: formAuthor,
          date: formDate,
          excerpt: formExcerpt,
          content: formContent,
          category: JSON.stringify(selectedCategories),
          status,
        };
        setCoverFile(null);

        toast.success(
          t("manage_blog.edit_success") || "Article updated successfully!"
        );
      } else {
        // Create
        const { error } = await supabase.from("blogs").insert(blogData);
        if (error) throw error;

        toast.success(
          t("manage_blog.add_success") || "Article added successfully!"
        );
        router.push("/manage-blog");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save article");
    } finally {
      setIsSaving(false);
    }
  };

  const isEditMode = !!blogId;

  return (
    <div className="space-y-6 pb-24">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground">
        <Link
          href="/manage-blog"
          className="hover:text-foreground transition-colors"
        >
          {t("manage_blog.title") || "Manage Blog"}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium">
          {isEditMode
            ? t("manage_blog.edit_title") || "Edit Article"
            : t("manage_blog.add_title") || "Add Article"}
        </span>
      </nav>

      {/* Title */}
      <h1 className="text-3xl font-bold text-foreground">
        {isEditMode
          ? t("manage_blog.edit_title") || "Edit Article"
          : t("manage_blog.add_title") || "Add Article"}
      </h1>

      {/* Unsaved indicator */}
      {isDirty && (
        <div className="flex items-center gap-2 text-sm text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          {t("manage_blog.unsaved_changes") || "Unsaved changes"}
        </div>
      )}

      {/* Section: General Information */}
      <div className="rounded-xl border bg-card p-6 space-y-5">
        <h2 className="text-lg font-semibold">
          {t("manage_blog.section_general") || "General Information"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <div className="space-y-2 md:col-span-2">
            <Label>{t("manage_blog.form_title") || "Article Title"}</Label>
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder={
                t("manage_blog.form_title_placeholder") ||
                "e.g. How AI is Changing the Future"
              }
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label>{t("manage_blog.form_slug") || "Slug"}</Label>
            <Input
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              placeholder="auto-generated-slug"
              className="font-mono text-sm"
            />
          </div>

          {/* Author */}
          <div className="space-y-2">
            <Label>{t("manage_blog.form_author") || "Author"}</Label>
            <Input
              value={formAuthor}
              onChange={(e) => setFormAuthor(e.target.value)}
              placeholder={
                t("manage_blog.form_author_placeholder") || "e.g. John Doe"
              }
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>{t("manage_blog.form_date") || "Publish Date"}</Label>
            <Input
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              placeholder={
                t("manage_blog.form_date_placeholder") ||
                "e.g. 16 Oktober 2024"
              }
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>{t("manage_blog.table_status") || "Status"}</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">
                  {t("manage_blog.status_draft") || "Draft"}
                </SelectItem>
                <SelectItem value="PUBLISHED">
                  {t("manage_blog.status_published") || "Published"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <Label>{t("manage_blog.form_category") || "Categories"}</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat.id}
                variant={
                  selectedCategories.includes(cat.name.toUpperCase())
                    ? "default"
                    : "outline"
                }
                className={`cursor-pointer transition-all ${
                  selectedCategories.includes(cat.name.toUpperCase())
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-muted"
                }`}
                onClick={() => toggleCategory(cat.name.toUpperCase())}
              >
                {cat.name}
              </Badge>
            ))}
          </div>
          {selectedCategories.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Selected: {selectedCategories.join(", ")}
            </p>
          )}
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label>{t("manage_blog.form_excerpt") || "Excerpt"}</Label>
          <Textarea
            value={formExcerpt}
            onChange={(e) => setFormExcerpt(e.target.value)}
            placeholder={
              t("manage_blog.form_excerpt_placeholder") ||
              "A short summary of the article..."
            }
            rows={3}
          />
        </div>
      </div>

      {/* Section: Cover Image */}
      <div className="rounded-xl border bg-card p-6 space-y-5">
        <h2 className="text-lg font-semibold">
          {t("manage_blog.form_cover") || "Cover Image"}
        </h2>

        <div className="flex items-start gap-6">
          {/* Preview */}
          <div className="w-48 h-28 rounded-lg border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/30 shrink-0">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground/30" />
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverChange}
                />
                <div className="flex items-center gap-2 px-4 py-2 rounded-md border bg-background hover:bg-muted transition-colors text-sm font-medium">
                  <Upload className="h-4 w-4" />
                  {coverPreview ? "Change Image" : "Upload Image"}
                </div>
              </label>
              {coverPreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCoverFile(null);
                    setCoverPreview(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Recommended: 16:9 aspect ratio, max 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Section: Content */}
      <div className="rounded-xl border bg-card p-6 space-y-5">
        <h2 className="text-lg font-semibold">
          {t("manage_blog.section_content") || "Article Content"}
        </h2>
        <RichTextEditor
          content={formContent}
          onChange={setFormContent}
          placeholder="Start writing your article..."
        />
      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-end gap-3 px-6 py-3 max-w-screen-2xl mx-auto">
          {isDirty && (
            <span className="text-sm text-amber-500 flex items-center gap-1.5 mr-auto">
              <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              {t("manage_blog.unsaved_changes") || "Unsaved changes"}
            </span>
          )}
          <Button
            variant="outline"
            onClick={() => router.push("/manage-blog")}
            disabled={isSaving}
          >
            {t("action.cancel") || "Cancel"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className={`gap-2 ${
              isDirty
                ? "ring-2 ring-amber-500/50 ring-offset-2 ring-offset-background"
                : ""
            }`}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSaving
              ? t("action.saving") || "Saving..."
              : t("action.save") || "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
