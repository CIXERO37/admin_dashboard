import { ManageGameForm } from "@/app/(dashboard)/manage-games/_components/manage-game-form";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Edit Game - Gameforsmart",
};

export default async function EditGamePage({ params }: { params: Promise<{ id: string }> }) {
  // Use the server client for server-side fetching
  const resolvedParams = await params;
  const supabase = await getSupabaseServerClient();
  const { data: game } = await supabase
    .from("master_games")
    .select("*")
    .eq("id", resolvedParams.id)
    .single();

  if (!game) {
    return <div className="p-12 text-center text-muted-foreground">Game not found</div>;
  }

  return <ManageGameForm initialData={game} gameId={resolvedParams.id} />;
}
