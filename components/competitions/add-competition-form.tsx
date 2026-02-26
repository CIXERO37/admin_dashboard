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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, ChevronRight } from "lucide-react";
import Link from "next/link";

export function AddCompetitionForm({ initialData, compId }: { initialData?: any; compId?: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [formTitle, setFormTitle] = useState(initialData?.title || "");
  const [formDesc, setFormDesc] = useState(initialData?.description || "");
  const [formRules, setFormRules] = useState(initialData?.rules ? initialData.rules.join("\n") : "");
  const [formStart, setFormStart] = useState(initialData?.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : "");
  const [formEnd, setFormEnd] = useState(initialData?.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : "");
  const [formStatus, setFormStatus] = useState(initialData?.status || "draft");
  const [formEducation, setFormEducation] = useState(initialData?.education || "");
  const [formClass, setFormClass] = useState(initialData?.class || "");
  const [formFee, setFormFee] = useState(initialData?.registration_fee?.toString() || "25000");
  const [formPrize, setFormPrize] = useState(initialData?.prize_pool?.toString() || "5000000");
  const [formLink, setFormLink] = useState(initialData?.registration_link || "");
  const [formPosterFile, setFormPosterFile] = useState<File | null>(null);
  const [formPosterPreview, setFormPosterPreview] = useState<string | null>(initialData?.poster_url || null);
  const [isSaving, setIsSaving] = useState(false);

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }
      setFormPosterFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormPosterPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formTitle || !formStart || !formEnd) {
      toast.error("Please fill required fields: title, start date, end date");
      return;
    }

    setIsSaving(true);
    let uploadedPosterUrl = initialData?.poster_url || null;

    try {
      if (formPosterFile) {
        const fileExt = formPosterFile.name.split('.').pop();
        const fileName = `${generateXID()}.${fileExt}`;
        const filePath = `posters/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("competitions")
          .upload(filePath, formPosterFile);
        
        if (uploadError && !uploadError.message.includes("Bucket not found")) {
           throw uploadError;
        }

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from("competitions")
            .getPublicUrl(filePath);
          uploadedPosterUrl = publicUrlData.publicUrl;
        }
      }

      const rulesArray = formRules.split("\n").filter((r: string) => r.trim() !== "");

      if (compId) {
        // Edit Mode
        const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + compId.substring(0, 4);
        
        const updateData = {
          title: formTitle,
          slug: slug,
          description: formDesc,
          rules: rulesArray,
          start_date: new Date(formStart).toISOString(),
          end_date: new Date(formEnd).toISOString(),
          poster_url: uploadedPosterUrl,
          status: formStatus,
          education: formEducation || null,
          class: formClass || null,
          registration_fee: Number(formFee),
          prize_pool: Number(formPrize),
          registration_link: formLink || null,
        };

        const { error } = await supabase
          .from("competitions")
          .update(updateData)
          .eq("id", compId);

        if (error) throw error;
        toast.success(t("comp_detail.edit") + " Success!");
        router.push(`/manage-competitions/${compId}`);
      } else {
        // Add Mode
        const newId = generateXID();
        const slug = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + newId.substring(0, 4);

        const { error } = await supabase
          .from("competitions")
          .insert({
            id: newId,
            title: formTitle,
            slug: slug,
            description: formDesc,
            rules: rulesArray,
            start_date: new Date(formStart).toISOString(),
            end_date: new Date(formEnd).toISOString(),
            poster_url: uploadedPosterUrl,
            status: formStatus,
            education: formEducation || null,
            class: formClass || null,
            registration_fee: Number(formFee),
            prize_pool: Number(formPrize),
            registration_link: formLink || null,
          });

        if (error) throw error;
        toast.success(t("manage_competitions.form_save") + " Success!");
        router.push("/manage-competitions");
      }


    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save competition");
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
            <Link href="/manage-competitions" className="hover:text-foreground transition-colors cursor-pointer">
              {t("manage_competitions.title") || "Competitions"}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            {compId && (
              <>
                <Link href={`/manage-competitions/${compId}`} className="hover:text-foreground transition-colors cursor-pointer">
                  {t("comp_detail.breadcrumb") || "Competition Detail"}
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
              </>
            )}
            <span className="text-foreground font-medium">
              {compId ? (t("comp_detail.edit") || "Edit") : (t("action.add") || "Add")}
            </span>
          </nav>
          <h1 className="text-2xl font-bold text-foreground">
            {compId ? t("comp_detail.edit") || "Edit Competition" : t("manage_competitions.add_dialog_title") || "Add Competition"}
          </h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : (compId ? (t("action.save") || "Save") : (t("action.add") || "Add"))}
        </Button>
      </div>

      <div className="grid gap-6 p-6 border rounded-lg bg-card">
        {/* Title */}
        <div className="grid gap-2">
          <Label htmlFor="comp-title">{t("manage_competitions.form_title") || "Title"}</Label>
          <Input 
             id="comp-title" 
             placeholder="e.g. Cerdas Cermat Online - Sains" 
             value={formTitle}
             onChange={(e) => setFormTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="grid gap-2">
          <Label htmlFor="comp-desc">{t("manage_competitions.form_desc") || "Description"}</Label>
          <Textarea
            id="comp-desc"
            placeholder="Write competition details, prizes..."
            rows={4}
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
          />
        </div>

        {/* Rules */}
        <div className="grid gap-2">
          <Label htmlFor="comp-rules">{t("manage_competitions.form_rules") || "Rules"}</Label>
          <Textarea
            id="comp-rules"
            placeholder="1. Each participant may only register once&#10;2. ...&#10;3. ..."
            rows={4}
            value={formRules}
            onChange={(e) => setFormRules(e.target.value)}
          />
        </div>

        {/* Horizontal Layout for Poster and Dates */}
        <div className="grid grid-cols-1 lg:grid-cols-[384px_1fr] gap-x-8 gap-y-6">
          {/* Poster Upload */}
          <div className="grid gap-2">
            <Label>{t("manage_competitions.form_poster") || "Poster"}</Label>
            {formPosterPreview ? (
              <div className="relative rounded-md overflow-hidden border bg-muted w-fit h-fit">
                <img
                  src={formPosterPreview}
                  alt="Poster preview"
                  className="w-full max-w-sm max-h-[220px] object-contain"
                />
                <button
                  type="button"
                  onClick={() => { setFormPosterPreview(null); setFormPosterFile(null); }}
                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="poster-upload"
                className="flex flex-col items-center justify-center h-full min-h-[140px] w-full max-w-sm rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <Upload className="h-6 w-6 text-muted-foreground/50 mb-2" />
                <span className="text-sm text-muted-foreground">{t("manage_competitions.form_upload_poster") || "Click to upload poster"}</span>
                <span className="text-[11px] text-muted-foreground/60 mt-0.5">JPG, PNG up to 5MB</span>
                <input
                  id="poster-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePosterChange}
                />
              </label>
            )}
          </div>

          {/* Dates - stacked vertically */}
          <div className="flex flex-col justify-start gap-4 max-w-xs">
            <div className="grid gap-2">
              <Label htmlFor="comp-start">{t("manage_competitions.form_start_date") || "Start Date"}</Label>
              <Input id="comp-start" type="date" value={formStart} onChange={(e) => setFormStart(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comp-end">{t("manage_competitions.form_end_date") || "End Date"}</Label>
              <Input id="comp-end" type="date" value={formEnd} onChange={(e) => setFormEnd(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Status, Education, Class, Fee & Prize — full width */}
        <div className="flex flex-wrap xl:flex-nowrap gap-4 w-full">
          <div className="grid gap-2 w-[140px] shrink-0">
            <Label>{t("manage_competitions.form_status") || "Status"}</Label>
            <Select value={formStatus} onValueChange={setFormStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">{t("comp_detail.status_draft") || "Draft"}</SelectItem>
                <SelectItem value="coming_soon">{t("comp_detail.status_coming_soon") || "Coming Soon"}</SelectItem>
                <SelectItem value="published">{t("comp_detail.status_published") || "Published"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 w-[170px] shrink-0">
            <Label>{t("manage_competitions.form_education") || "Education"}</Label>
            <Select value={formEducation} onValueChange={(val) => { setFormEducation(val); setFormClass(""); }}>
              <SelectTrigger>
                <SelectValue placeholder={t("manage_competitions.form_education_placeholder") || "Select education"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SD">{t("manage_competitions.form_education_sd") || "Elementary School"}</SelectItem>
                <SelectItem value="SMP">{t("manage_competitions.form_education_smp") || "Junior High School"}</SelectItem>
                <SelectItem value="SMA">{t("manage_competitions.form_education_sma") || "Senior High School"}</SelectItem>
                <SelectItem value="College">{t("manage_competitions.form_education_college") || "College/University"}</SelectItem>
                <SelectItem value="Others">{t("manage_competitions.form_education_others") || "Others"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 min-w-[10px] shrink-0">
            <Label>{t("manage_competitions.form_class") || "Class"}</Label>
            <Select value={formClass} onValueChange={setFormClass} disabled={!formEducation || formEducation === "College" || formEducation === "Others"}>
              <SelectTrigger>
                <SelectValue placeholder={!formEducation ? (t("manage_competitions.form_class_select_edu") || "Select education first") : (formEducation === "College" || formEducation === "Others") ? (t("manage_competitions.form_class_not_applicable") || "Not applicable") : (t("manage_competitions.form_class_placeholder") || "Select class")} />
              </SelectTrigger>
              <SelectContent>
                {formEducation === "SD" && (
                  <>
                    <SelectItem value="1">{t("manage_competitions.class_level") || "Grade"} 1</SelectItem>
                    <SelectItem value="2">{t("manage_competitions.class_level") || "Grade"} 2</SelectItem>
                    <SelectItem value="3">{t("manage_competitions.class_level") || "Grade"} 3</SelectItem>
                    <SelectItem value="4">{t("manage_competitions.class_level") || "Grade"} 4</SelectItem>
                    <SelectItem value="5">{t("manage_competitions.class_level") || "Grade"} 5</SelectItem>
                    <SelectItem value="6">{t("manage_competitions.class_level") || "Grade"} 6</SelectItem>
                  </>
                )}
                {formEducation === "SMP" && (
                  <>
                    <SelectItem value="7">{t("manage_competitions.class_level") || "Grade"} 7</SelectItem>
                    <SelectItem value="8">{t("manage_competitions.class_level") || "Grade"} 8</SelectItem>
                    <SelectItem value="9">{t("manage_competitions.class_level") || "Grade"} 9</SelectItem>
                  </>
                )}
                {formEducation === "SMA" && (
                  <>
                    <SelectItem value="10">{t("manage_competitions.class_level") || "Grade"} 10</SelectItem>
                    <SelectItem value="11">{t("manage_competitions.class_level") || "Grade"} 11</SelectItem>
                    <SelectItem value="12">{t("manage_competitions.class_level") || "Grade"} 12</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 w-[120px] shrink-0">
            <Label>{t("manage_competitions.form_reg_fee") || "Registration Fee"}</Label>
            <Select value={formFee} onValueChange={setFormFee}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25000">Rp 25.000</SelectItem>
                <SelectItem value="50000">Rp 50.000</SelectItem>
                <SelectItem value="100000">Rp 100.000</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 w-[120px] shrink-0">
            <Label>{t("manage_competitions.form_prize") || "Total Prize"}</Label>
            <Select value={formPrize} onValueChange={setFormPrize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5000000">Rp 5.000.000</SelectItem>
                <SelectItem value="10000000">Rp 10.000.000</SelectItem>
                <SelectItem value="20000000">Rp 20.000.000</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Registration Link */}
        <div className="grid gap-2">
          <Label htmlFor="comp-link">{t("manage_competitions.form_reg_link") || "Registration Link"} <span className="text-muted-foreground font-normal">{t("manage_competitions.form_reg_link_opt") || "(optional)"}</span></Label>
          <Input id="comp-link" placeholder="https://..." value={formLink} onChange={(e) => setFormLink(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
