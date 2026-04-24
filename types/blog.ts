export interface Blog {
  id: string;
  slug: string;
  title: string;
  author: string;
  date: string | null;
  category: string[];
  excerpt: string | null;
  content: string | null;
  image: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type BlogInput = Omit<Blog, "id" | "created_at" | "updated_at">;

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}
