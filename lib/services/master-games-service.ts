import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { MasterGame, MasterGameInput } from "@/types/master-game";

const supabase = getSupabaseBrowserClient();

export const masterGamesService = {
  async getGames(): Promise<MasterGame[]> {
    const { data, error } = await supabase
      .from("master_games")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as MasterGame[];
  },

  async getGameById(id: string): Promise<MasterGame> {
    const { data, error } = await supabase
      .from("master_games")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as MasterGame;
  },

  async createGame(input: MasterGameInput): Promise<MasterGame> {
    const { data, error } = await supabase
      .from("master_games")
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    return data as MasterGame;
  },

  async updateGame(id: string, input: Partial<MasterGameInput>): Promise<MasterGame> {
    const { data, error } = await supabase
      .from("master_games")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as MasterGame;
  },

  async deleteGame(id: string): Promise<void> {
    const { error } = await supabase.from("master_games").delete().eq("id", id);
    if (error) throw error;
  },
};
