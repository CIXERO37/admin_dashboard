import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { masterGamesService } from "@/lib/services/master-games-service";
import { MasterGame } from "@/types/master-game";

export function useManageGamesTable() {
  const [games, setGames] = useState<MasterGame[]>([]);
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
  const [deleteTarget, setDeleteTarget] = useState<MasterGame | null>(null);
  const [deleteConfirmationPhrase, setDeleteConfirmationPhrase] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const data = await masterGamesService.getGames();
      setGames(data);
    } catch (error: any) {
      console.error("Error fetching master games:", error);
      toast.error(error.message || "Failed to load games");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const filtered = useMemo(
    () =>
      games.filter(
        (g) =>
          g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.application?.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [games, searchQuery]
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
    return paginated.map((game) => ({
      id: game.id,
      image: game.image,
      title: game.title,
      application: game.application,
      genre: game.genre,
      played_count: game.played_count,
      is_favorite: game.is_favorite,
    }));
  }, [paginated]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleDeleteGame = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await masterGamesService.deleteGame(deleteTarget.id);
      setGames(games.filter((g) => g.id !== deleteTarget.id));
      toast.success("Game deleted successfully");
      setDeleteTarget(null);
      setDeleteConfirmationPhrase("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete game");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    games,
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
    handleDeleteGame,
  };
}
