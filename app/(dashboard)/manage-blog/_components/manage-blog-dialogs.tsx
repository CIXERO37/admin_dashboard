import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Blog } from "@/types/blog";

interface ManageBlogDialogsProps {
  t: any;
  previewImage: { url: string; title: string } | null;
  setPreviewImage: (val: { url: string; title: string } | null) => void;
  deleteTarget: Blog | null;
  setDeleteTarget: (val: Blog | null) => void;
  deleteConfirmationPhrase: string;
  setDeleteConfirmationPhrase: (val: string) => void;
  isDeleting: boolean;
  handleDeleteBlog: () => void;
}

export function ManageBlogDialogs({
  t,
  previewImage,
  setPreviewImage,
  deleteTarget,
  setDeleteTarget,
  deleteConfirmationPhrase,
  setDeleteConfirmationPhrase,
  isDeleting,
  handleDeleteBlog,
}: ManageBlogDialogsProps) {
  const deletePhrase = t("action.delete") || "Delete";

  return (
    <>
      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-lg p-2 flex flex-col gap-2 border shadow-lg bg-card text-card-foreground">
          <DialogTitle className="sr-only">
            {t("manage_blog.table_cover") || "Cover Preview"}
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
                  {t("action.delete") || "Delete"} Article
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="text-sm text-muted-foreground mb-4">
                  <p>
                    This action cannot be undone. Are you sure you want to delete{" "}
                    <span className="font-bold text-primary">
                      {deleteTarget.title && deleteTarget.title.length > 40
                        ? deleteTarget.title.substring(0, 40) + "..."
                        : deleteTarget.title}
                    </span>
                    ?
                  </p>
                </div>
                <Label className="text-sm font-medium mb-2 block">
                  Please type{" "}
                  <span className="font-bold select-none text-destructive">
                    &quot;{deletePhrase}&quot;
                  </span>{" "}
                  to confirm.
                </Label>
                <Input
                  value={deleteConfirmationPhrase}
                  onChange={(e) => setDeleteConfirmationPhrase(e.target.value)}
                  placeholder={`Type '${deletePhrase}'`}
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
                  disabled={deleteConfirmationPhrase !== deletePhrase || isDeleting}
                  onClick={handleDeleteBlog}
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
