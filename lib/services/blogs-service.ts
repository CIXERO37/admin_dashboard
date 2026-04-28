import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Blog, BlogInput, BlogCategory } from "@/types/blog";

export const blogsService = {
  async getBlogs(): Promise<Blog[]> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as Blog[];
  },

  async getBlogById(id: string): Promise<Blog> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as Blog;
  },

  async deleteBlog(id: string): Promise<void> {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) throw error;
  },

  async getCategories(): Promise<BlogCategory[]> {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("blog_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data as BlogCategory[];
  },

  async createCategory(payload: { name: string; slug: string }) {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("blog_categories").insert([
      { name: payload.name.trim(), slug: payload.slug.trim() },
    ]);
    if (error) throw error;
    return { error: null };
  },

  async updateCategory(id: string, payload: { name: string; slug: string }) {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
      .from("blog_categories")
      .update({
        name: payload.name.trim(),
        slug: payload.slug.trim(),
      })
      .eq("id", id);
    if (error) throw error;
    return { error: null };
  },

  async deleteCategory(id: string) {
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.from("blog_categories").delete().eq("id", id);
    if (error) throw error;
    return { error: null };
  },
};
