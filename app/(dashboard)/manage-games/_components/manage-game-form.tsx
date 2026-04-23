"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import { toast } from "sonner";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { generateXID } from "@/lib/id-generator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Upload, X, ChevronRight, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MasterGameInput } from "@/types/master-game";

export function ManageGameForm({ initialData, gameId }: { initialData?: any; gameId?: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [formTitle, setFormTitle] = useState(initialData?.title || "");
  const [formApp, setFormApp] = useState(initialData?.application || "");
  const [formGenre, setFormGenre] = useState(initialData?.genre || "");
  const [formType, setFormType] = useState(initialData?.type || "");
  const [formPlatform, setFormPlatform] = useState(initialData?.platform || "");
  const [categoriesStr, setCategoriesStr] = useState(initialData?.categories ? initialData.categories.join(", ") : "");
  const [hashtagsStr, setHashtagsStr] = useState(initialData?.hashtags ? initialData.hashtags.join(", ") : "");
  const [formPlayUrl, setFormPlayUrl] = useState(initialData?.play_url || "");
  const [formVideoUrl, setFormVideoUrl] = useState(initialData?.video_url || "");
  const [formDesc, setFormDesc] = useState(initialData?.description || "");
  const [isFavorite, setIsFavorite] = useState(initialData?.is_favorite || false);
  const [status, setStatus] = useState(initialData?.status || "DRAFT");

  // JSONB Arrays
  const [features, setFeatures] = useState<any[]>(initialData?.features || []);
  const [howToPlay, setHowToPlay] = useState<any[]>(initialData?.how_to_play || []);
  const [characters, setCharacters] = useState<any[]>(initialData?.characters || []);
  const [charactersTitle, setCharactersTitle] = useState(initialData?.characters_title || "");

  // File Uploads
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialData?.image || null);
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialData?.logo || null);

  const [existingScreenshots, setExistingScreenshots] = useState<string[]>(initialData?.screenshots || []);
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'logo') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'cover') {
          setCoverFile(file);
          setCoverPreview(reader.result as string);
        } else {
          setLogoFile(file);
          setLogoPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024);
    if (validFiles.length < files.length) {
      toast.error("Some files exceed 5MB limit");
    }

    setScreenshotFiles(prev => [...prev, ...validFiles]);
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingScreenshot = (idx: number) => {
    setExistingScreenshots(prev => prev.filter((_, i) => i !== idx));
  };

  const removeNewScreenshot = (idx: number) => {
    setScreenshotFiles(prev => prev.filter((_, i) => i !== idx));
    setScreenshotPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const uploadFile = async (file: File, folder: string) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `${folder}/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("master_games")
      .upload(filePath, file, { upsert: true });

    if (uploadError && !uploadError.message.includes("Bucket not found")) {
      throw uploadError;
    }
    const { data: publicUrlData } = supabase.storage
      .from("master_games")
      .getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  };

  const handleSave = async () => {
    if (!formTitle || !formApp) {
      toast.error("Please fill required fields: Title and Application");
      return;
    }

    setIsSaving(true);
    try {
      let uploadedCoverUrl = initialData?.image || null;
      let uploadedLogoUrl = initialData?.logo || null;

      if (coverFile) uploadedCoverUrl = await uploadFile(coverFile, "covers");
      if (logoFile) uploadedLogoUrl = await uploadFile(logoFile, "logos");

      let finalScreenshots = [...existingScreenshots];
      for (const file of screenshotFiles) {
        const url = await uploadFile(file, "screenshots");
        if (url) finalScreenshots.push(url);
      }

      const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const categoriesArray = categoriesStr.split(",").map((s: string) => s.trim()).filter(Boolean);
      const hashtagsArray = hashtagsStr.split(",").map((s: string) => s.trim()).filter(Boolean);

      const gameData: MasterGameInput = {
        title: formTitle,
        slug: slug,
        application: formApp,
        genre: formGenre || null,
        type: formType || null,
        platform: formPlatform || null,
        play_url: formPlayUrl || null,
        video_url: formVideoUrl || null,
        description: formDesc || null,
        image: uploadedCoverUrl,
        logo: uploadedLogoUrl,
        features: features.length > 0 ? features : null,
        how_to_play: howToPlay.length > 0 ? howToPlay : null,
        characters: characters.length > 0 ? characters : null,
        characters_title: charactersTitle || null,
        categories: categoriesArray.length > 0 ? categoriesArray : null,
        hashtags: hashtagsArray.length > 0 ? hashtagsArray : null,
        screenshots: finalScreenshots.length > 0 ? finalScreenshots : null,
        is_favorite: isFavorite,
        status: status,
      };

      if (gameId) {
        const { error } = await supabase.from("master_games").update(gameData).eq("id", gameId);
        if (error) throw error;
        toast.success(t("manage_games.edit_success") || "Game updated successfully!");
        router.push(`/manage-games/${gameId}`);
      } else {
        const newId = generateXID();
        const { error } = await supabase.from("master_games").insert({
          id: newId,
          ...gameData
        });
        if (error) throw error;
        toast.success(t("manage_games.add_success") || "Game added successfully!");
        router.push("/manage-games");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save game");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/manage-games" className="hover:text-foreground transition-colors cursor-pointer">
              {t("manage_games.title") || "Manage Games"}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{gameId ? t("action.edit") || "Edit" : t("action.add") || "Add"}</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight">{gameId ? t("manage_games.edit_title") || "Edit Game" : t("manage_games.add_title") || "Add Game"}</h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="cursor-pointer">{gameId ? t("action.save") || "Save" : t("action.add") || "Add"}</Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Main Info */}
        <div className="xl:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card p-6 space-y-5">
            <h2 className="font-semibold text-lg border-b pb-2">{t("manage_games.section_general") || "General Information"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="game-title">{t("manage_games.form_title") || "Title"} *</Label>
                <Input id="game-title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="game-app">{t("manage_games.form_application") || "Application ID"} *</Label>
                <Input id="game-app" value={formApp} onChange={(e) => setFormApp(e.target.value)} placeholder="e.g. crazyrace" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="game-genre">{t("manage_games.form_genre") || "Genre"}</Label>
                <Input id="game-genre" value={formGenre} onChange={(e) => setFormGenre(e.target.value)} placeholder="e.g. Action" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="game-type">{t("manage_games.form_type") || "Type"}</Label>
                <Input id="game-type" value={formType} onChange={(e) => setFormType(e.target.value)} placeholder="e.g. HTML5" />
              </div>
            </div>

            <div className="grid gap-2 mt-4">
              <Label htmlFor="game-desc">{t("manage_games.form_description") || "Description"}</Label>
              <Textarea id="game-desc" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={4} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="game-tags">{t("manage_games.form_tags") || "Question Categories"}</Label>
                <Input id="game-tags" value={categoriesStr} onChange={(e) => setCategoriesStr(e.target.value)} placeholder={t("manage_games.form_tags_placeholder") || "e.g. History, Math"} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="game-hashtags">{t("manage_games.form_hashtags") || "Search Hashtags"}</Label>
                <Input id="game-hashtags" value={hashtagsStr} onChange={(e) => setHashtagsStr(e.target.value)} placeholder={t("manage_games.form_hashtags_placeholder") || "e.g. #space, #shooter"} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="game-play">{t("manage_games.form_play_url") || "Play URL"}</Label>
                <Input id="game-play" value={formPlayUrl} onChange={(e) => setFormPlayUrl(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="game-video">{t("manage_games.form_video_url") || "Video URL"}</Label>
                <Input id="game-video" value={formVideoUrl} onChange={(e) => setFormVideoUrl(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Features JSON */}
          <div className="rounded-xl border bg-card p-6 space-y-5 mt-6">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="font-semibold text-lg">{t("manage_games.section_features") || "Features"}</h2>
              <Button size="sm" variant="outline" onClick={() => setFeatures([...features, { title: "", icon: "", description: "" }])}>
                <Plus className="h-4 w-4 mr-2" /> Add Feature
              </Button>
            </div>
            
            <div className="space-y-4">
              {features.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No features added yet.</p>
              ) : (
                features.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 border rounded-lg bg-muted/20">
                    <div className="grid gap-3 flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Feature Title</Label>
                          <Input value={item.title || ""} onChange={(e) => {
                            const newArr = [...features];
                            newArr[idx].title = e.target.value;
                            setFeatures(newArr);
                          }} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Icon</Label>
                          <Input value={item.icon || ""} onChange={(e) => {
                            const newArr = [...features];
                            newArr[idx].icon = e.target.value;
                            setFeatures(newArr);
                          }} placeholder="e.g. lucide-star" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Description</Label>
                        <Textarea value={item.description || ""} onChange={(e) => {
                          const newArr = [...features];
                          newArr[idx].description = e.target.value;
                          setFeatures(newArr);
                        }} rows={2} />
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 shrink-0" onClick={() => {
                      setFeatures(features.filter((_, i) => i !== idx));
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* How to play JSON */}
          <div className="rounded-xl border bg-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="font-semibold text-lg">{t("manage_games.section_how_to_play") || "How to Play"}</h2>
              <Button size="sm" variant="outline" onClick={() => setHowToPlay([...howToPlay, { step: "", title: "", description: "" }])}>
                <Plus className="h-4 w-4 mr-2" /> Add Step
              </Button>
            </div>
            
            <div className="space-y-4">
              {howToPlay.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No steps added yet.</p>
              ) : (
                howToPlay.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 border rounded-lg bg-muted/20">
                    <div className="grid gap-3 flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Step Number</Label>
                          <Input value={item.step || ""} onChange={(e) => {
                            const newArr = [...howToPlay];
                            newArr[idx].step = e.target.value;
                            setHowToPlay(newArr);
                          }} placeholder="e.g. 1" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Title</Label>
                          <Input value={item.title || ""} onChange={(e) => {
                            const newArr = [...howToPlay];
                            newArr[idx].title = e.target.value;
                            setHowToPlay(newArr);
                          }} placeholder="e.g. Buat ruang atau gabung" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Description</Label>
                        <Textarea value={item.description || ""} onChange={(e) => {
                          const newArr = [...howToPlay];
                          newArr[idx].description = e.target.value;
                          setHowToPlay(newArr);
                        }} />
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 shrink-0" onClick={() => {
                      setHowToPlay(howToPlay.filter((_, i) => i !== idx));
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Characters JSON */}
          <div className="rounded-xl border bg-card p-6 space-y-5">
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="font-semibold text-lg">{t("manage_games.section_characters") || "Characters"}</h2>
              <Button size="sm" variant="outline" onClick={() => setCharacters([...characters, { name: "", icon: "", description: "" }])}>
                <Plus className="h-4 w-4 mr-2" /> Add Character
              </Button>
            </div>
            
            <div className="grid gap-2">
              <Label>{t("manage_games.form_characters_title") || "Section Title (Optional)"}</Label>
              <Input value={charactersTitle} onChange={(e) => setCharactersTitle(e.target.value)} placeholder="e.g. Meet the Heroes" />
            </div>
            
            <div className="space-y-4">
              {characters.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No characters added yet.</p>
              ) : (
                characters.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 border rounded-lg bg-muted/20">
                    <div className="grid gap-3 flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label>Name</Label>
                          <Input value={item.name || ""} onChange={(e) => {
                            const newArr = [...characters];
                            newArr[idx].name = e.target.value;
                            setCharacters(newArr);
                          }} />
                        </div>
                        <div className="grid gap-2">
                          <Label>Icon / Image URL</Label>
                          <Input value={item.icon || ""} onChange={(e) => {
                            const newArr = [...characters];
                            newArr[idx].icon = e.target.value;
                            setCharacters(newArr);
                          }} placeholder="/images/char1.png" />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label>Description</Label>
                        <Textarea value={item.description || ""} onChange={(e) => {
                          const newArr = [...characters];
                          newArr[idx].description = e.target.value;
                          setCharacters(newArr);
                        }} rows={2} />
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 shrink-0" onClick={() => {
                      setCharacters(characters.filter((_, i) => i !== idx));
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Media & Toggles */}
        <div className="space-y-6 xl:sticky xl:top-24 xl:max-h-[calc(100vh-120px)] xl:overflow-y-auto xl:pr-2 xl:pb-4 scrollbar-thin">
          <div className="rounded-xl border bg-card p-6 space-y-5">
            <h2 className="font-semibold text-lg border-b pb-2">{t("manage_games.section_publishing") || "Publishing"}</h2>
            <div className="grid gap-2">
              <Label>{t("manage_games.form_status") || "Status"}</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PUBLISHED">{t("manage_games.status_published") || "Published"}</SelectItem>
                  <SelectItem value="DRAFT">{t("manage_games.status_draft") || "Draft"}</SelectItem>
                  <SelectItem value="COMING_SOON">{t("manage_games.status_coming_soon") || "Coming Soon"}</SelectItem>
                  <SelectItem value="MAINTENANCE">{t("manage_games.status_maintenance") || "Maintenance"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="space-y-0.5">
                <Label>{t("manage_games.table_favorite") || "Favorite"}</Label>
                <p className="text-xs text-muted-foreground">Tandai game ini sebagai favorit (Pilihan Editor).</p>
              </div>
              <Switch checked={isFavorite} onCheckedChange={setIsFavorite} />
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 space-y-5">
            <h2 className="font-semibold text-lg border-b pb-2">{t("manage_games.section_media") || "Media"}</h2>
            
            {/* Cover Upload */}
            <div className="grid gap-2">
              <Label>{t("manage_games.form_cover") || "Cover Image"}</Label>
              {coverPreview ? (
                <div className="relative rounded-md overflow-hidden border bg-muted w-full h-40 flex items-center justify-center">
                  <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setCoverPreview(null); setCoverFile(null); }} className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-40 w-full rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 text-muted-foreground/50 mb-2" />
                  <span className="text-sm text-muted-foreground">Upload Cover</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'cover')} />
                </label>
              )}
            </div>

            {/* Logo Upload */}
            <div className="grid gap-2 mt-4">
              <Label>{t("manage_games.form_logo") || "Logo"}</Label>
              {logoPreview ? (
                <div className="relative rounded-md overflow-hidden border bg-muted w-full h-32 flex items-center justify-center">
                  <img src={logoPreview} alt="Logo preview" className="max-w-full max-h-full object-contain p-2" />
                  <button type="button" onClick={() => { setLogoPreview(null); setLogoFile(null); }} className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 w-full rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 text-muted-foreground/50 mb-2" />
                  <span className="text-sm text-muted-foreground">Upload Logo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, 'logo')} />
                </label>
              )}
            </div>

            {/* Screenshots Upload */}
            <div className="grid gap-2 mt-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label>{t("manage_games.form_screenshots") || "Screenshots"}</Label>
                <label className="cursor-pointer text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1">
                  <Upload className="h-3.5 w-3.5" /> Upload
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleScreenshotChange} />
                </label>
              </div>
              
              {(existingScreenshots.length > 0 || screenshotPreviews.length > 0) ? (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {existingScreenshots.map((url, idx) => (
                    <div key={`exist-${idx}`} className="relative rounded-md overflow-hidden border bg-muted h-24 flex items-center justify-center">
                      <img src={url} alt={`Screenshot ${idx}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeExistingScreenshot(idx)} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {screenshotPreviews.map((url, idx) => (
                    <div key={`new-${idx}`} className="relative rounded-md overflow-hidden border bg-muted h-24 flex items-center justify-center">
                      <img src={url} alt={`New Screenshot ${idx}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeNewScreenshot(idx)} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-24 w-full rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/30 text-muted-foreground text-sm">
                  No screenshots uploaded
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
