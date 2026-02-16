"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ImageZoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  src: string
  alt?: string
}

export function ImageZoomDialog({
  open,
  onOpenChange,
  src,
  alt,
}: ImageZoomDialogProps) {
  if (!src) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="fixed !top-0 !left-0 !right-0 !bottom-0 !z-[50] !max-w-none !w-screen !h-screen !m-0 !p-0 !translate-x-0 !translate-y-0 !rounded-none bg-black/95 border-none shadow-none outline-none flex items-center justify-center [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()} // Prevent clicking overlay
      >
        <DialogTitle className="sr-only">Image Zoom View</DialogTitle>

        {/* Close Button - Fixed Position */}
        <div className="fixed top-4 right-4 md:top-6 md:right-6 z-[100]">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="rounded-full bg-black/50 text-white hover:bg-black/80 hover:text-white border border-white/20 h-10 w-10 md:h-12 md:w-12 backdrop-blur-md transition-all hover:scale-105 shadow-xl"
            title="Close Zoom"
          >
            <X className="h-5 w-5 md:h-6 md:w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Image Display */}
        <div className="relative w-full h-full flex items-center justify-center p-4 md:p-10 pointer-events-none">
          <img
            src={src}
            alt={alt || "Full size preview"}
            className="max-h-[90vh] max-w-[90vw] w-auto h-auto object-contain rounded-md shadow-2xl pointer-events-auto"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
