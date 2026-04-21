import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MasterGame } from "@/types/master-game";

interface ManageGamesDialogsProps {
  t: any;
  previewImage: { url: string; title: string } | null;
  setPreviewImage: (val: { url: string; title: string } | null) => void;
  deleteTarget: MasterGame | null;
  setDeleteTarget: (val: MasterGame | null) => void;
  deleteConfirmationPhrase: string;
  setDeleteConfirmationPhrase: (val: string) => void;
  isDeleting: boolean;
  handleDeleteGame: () => void;
}

export function ManageGamesDialogs({
  t,
  previewImage,
  setPreviewImage,
  deleteTarget,
  setDeleteTarget,
  deleteConfirmationPhrase,
  setDeleteConfirmationPhrase,
  isDeleting,
  handleDeleteGame,
}: ManageGamesDialogsProps) {
  return (
    <>
      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-lg p-2 flex flex-col gap-2 border shadow-lg bg-card text-card-foreground">
          <DialogTitle className="sr-only">
            {t("manage_games.image_preview") || "Image Preview"}
          </DialogTitle>
          {previewImage && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium px-2 pt-2">{previewImage.title}</p>
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="w-full rounded-md object-contain max-h-[70vh] bg-muted/20"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[425px]">
          {!deleteTarget ? null : (
            <>
              <DialogHeader>
                <DialogTitle className="text-destructive">
                  {t("manage_games.delete_confirm_title") || "Delete Game"}
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="text-sm text-muted-foreground mb-4">
                  {(() => {
                    const desc =
                      t("manage_games.delete_confirm_desc") ||
                      "This action cannot be undone. Are you sure you want to delete {{name}}?";
                    if (desc.includes("{{name}}")) {
                      const parts = desc.split("{{name}}");
                      return (
                        <p title={deleteTarget.title}>
                          {parts[0]}
                          <span className="font-bold text-primary">
                            {deleteTarget.title.length > 40
                              ? deleteTarget.title.substring(0, 40) + "..."
                              : deleteTarget.title}
                          </span>
                          {parts[1]}
                        </p>
                      );
                    }
                    return desc;
                  })()}
                </div>
                <Label className="text-sm font-medium mb-2 block">
                  {(() => {
                    const instr =
                      t("manage_games.delete_confirm_instruction") ||
                      "Please type Delete Game to confirm.";
                    const phrase = t("manage_games.delete_phrase") || "Delete Game";
                    if (instr.includes(phrase)) {
                      const parts = instr.split(phrase);
                      return (
                        <>
                          {parts[0]}
                          <span className="font-bold select-none text-destructive">
                            "{phrase}"
                          </span>
                          {parts[1]}
                        </>
                      );
                    }
                    return instr;
                  })()}
                </Label>
                <Input
                  value={deleteConfirmationPhrase}
                  onChange={(e) => setDeleteConfirmationPhrase(e.target.value)}
                  placeholder={t("manage_games.delete_phrase") || "Type 'Delete Game'"}
                  autoComplete="off"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                >
                  {t("action.cancel") || "Cancel"}
                </Button>
                <Button
                  variant="destructive"
                  disabled={
                    deleteConfirmationPhrase !==
                      (t("manage_games.delete_phrase") || "Delete Game") || isDeleting
                  }
                  onClick={handleDeleteGame}
                >
                  {isDeleting ? "Deleting..." : t("action.delete") || "Delete"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
