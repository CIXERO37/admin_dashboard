export interface MasterGame {
  id: string;
  slug: string;
  title: string;
  type: string | null;
  genre: string | null;
  platform: string | null;
  image: string | null;
  logo: string | null;
  play_url: string | null;
  application: string | null;
  video_url: string | null;
  description: string | null;
  features: any[] | null;
  how_to_play: any[] | null;
  characters_title: string | null;
  characters: any[] | null;
  categories: string[] | null;
  screenshots: string[] | null;
  is_favorite: boolean;
  played_count: number;
  created_at: string;
  updated_at: string;
}

export type MasterGameInput = Omit<MasterGame, "id" | "played_count" | "created_at" | "updated_at">;
