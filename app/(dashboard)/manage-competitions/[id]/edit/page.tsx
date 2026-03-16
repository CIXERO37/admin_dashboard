"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { AddCompetitionForm } from "@/components/competitions/add-competition-form";

export default function EditCompetitionPage() {
  const params = useParams();
  const router = useRouter();
  const compId = params.id as string;
  const supabase = getSupabaseBrowserClient();

  const [detail, setDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getDetail() {
      const { data, error } = await supabase
        .from("competitions")
        .select("*")
        .eq("id", compId)
        .single();
      
      if (error) {
        toast.error("Competition not found");
        router.push("/manage-competitions");
        return;
      }
      
      setDetail(data);
      setIsLoading(false);
    }
    getDetail();
  }, [compId, supabase, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground animate-pulse">Loading competition details...</p>
      </div>
    );
  }

  return <AddCompetitionForm initialData={detail} compId={compId} />;
}
