"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/dashboard/data-table";
import { Skeleton } from "@/components/ui/skeleton";

import { useManageBlogTable } from "./_hooks/use-manage-blog-table";
import { getManageBlogColumns } from "./_components/manage-blog-columns";
import { ManageBlogDialogs } from "./_components/manage-blog-dialogs";

export function ManageBlogClient() {
  const router = useRouter();
  const { t } = useTranslation();

  const {
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
  } = useManageBlogTable();

  const blogColumns = getManageBlogColumns(
    t,
    (url, title) => setPreviewImage({ url, title }),
    (item) => {
      setDeleteTarget(item);
      setDeleteConfirmationPhrase("");
    }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground">
          {t("manage_blog.title") || "Manage Blog"}
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              placeholder={t("manage_blog.search_placeholder") || "Search by title..."}
              className="pr-10 w-full sm:w-64 bg-background border-border"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={handleSearch}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>
          <Button className="gap-1.5 shrink-0" onClick={() => router.push("/manage-blog/add")}>
            <Plus className="h-4 w-4" />
            {t("action.add") || "Add"}
          </Button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <Skeleton className="h-[600px] w-full rounded-xl" />
      ) : (
        <DataTable
          columns={blogColumns}
          data={tableData as Record<string, unknown>[]}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page: number) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onRowClick={(row) => router.push(`/manage-blog/${row.id}`)}
        />
      )}

      {/* Dialogs */}
      <ManageBlogDialogs
        t={t}
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
        deleteTarget={deleteTarget}
        setDeleteTarget={setDeleteTarget}
        deleteConfirmationPhrase={deleteConfirmationPhrase}
        setDeleteConfirmationPhrase={setDeleteConfirmationPhrase}
        isDeleting={isDeleting}
        handleDeleteBlog={handleDeleteBlog}
      />
    </div>
  );
}
