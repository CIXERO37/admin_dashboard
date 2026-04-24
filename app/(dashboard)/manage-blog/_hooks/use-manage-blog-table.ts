import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { blogsService } from "@/lib/services/blogs-service";
import { Blog } from "@/types/blog";

export function useManageBlogTable() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
  const [deleteConfirmationPhrase, setDeleteConfirmationPhrase] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const data = await blogsService.getBlogs();
      setBlogs(data);
    } catch (error: any) {
      console.error("Error fetching blogs:", error);
      toast.error(error.message || "Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filtered = useMemo(
    () =>
      blogs.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.author?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [blogs, searchQuery]
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginated = useMemo(
    () =>
      filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filtered, currentPage, itemsPerPage]
  );

  const tableData = useMemo(() => {
    return paginated.map((blog) => ({
      id: blog.id,
      image: blog.image,
      title: blog.title,
      author: blog.author,
      category: blog.category,
      status: blog.status,
      created_at: blog.created_at,
    }));
  }, [paginated]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleDeleteBlog = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await blogsService.deleteBlog(deleteTarget.id);
      setBlogs(blogs.filter((b) => b.id !== deleteTarget.id));
      toast.success("Article deleted successfully");
      setDeleteTarget(null);
      setDeleteConfirmationPhrase("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    blogs,
    isLoading,
    searchInput,
    setSearchInput,
    handleSearch,
    handleKeyDown,
    previewImage,
    setPreviewImage,
    currentPage,
    setCurrentPage,
    totalPages,
    tableData,
    deleteTarget,
    setDeleteTarget,
    deleteConfirmationPhrase,
    setDeleteConfirmationPhrase,
    isDeleting,
    handleDeleteBlog,
  };
}
