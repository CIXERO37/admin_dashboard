import { ManageBlogForm } from "@/app/(dashboard)/manage-blog/_components/manage-blog-form";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Edit Article - Gameforsmart",
};

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const supabase = await getSupabaseServerClient();
  const { data: blog } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (!blog) {
    return <div className="p-12 text-center text-muted-foreground">Article not found</div>;
  }

  return <ManageBlogForm initialData={blog} blogId={resolvedParams.id} />;
}
