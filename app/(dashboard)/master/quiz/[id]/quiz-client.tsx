"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface QuizBreadcrumbProps {
  title: string
}

export function QuizBreadcrumb({ title }: QuizBreadcrumbProps) {
  const router = useRouter()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
