"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, User } from "lucide-react"
import { TrashQuizTable } from "./trash-quiz-table"
import { TrashUserTable } from "./trash-user-table"
import { TrashGroupTable } from "./trash-group-table"
import type { DeletedQuiz, DeletedUser, DeletedGroup } from "./actions"

interface TrashBinTabsProps {
  initialQuizzes: DeletedQuiz[]
  initialUsers: DeletedUser[]
  initialGroups: DeletedGroup[]
}

export function TrashBinTabs({ initialQuizzes, initialUsers, initialGroups }: TrashBinTabsProps) {
  const [activeTab, setActiveTab] = useState("quiz")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
        <TabsTrigger value="quiz" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span>Quiz</span>
        </TabsTrigger>
        <TabsTrigger value="user" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>User</span>
        </TabsTrigger>
        <TabsTrigger value="group" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>Group</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="quiz" className="mt-4">
        <TrashQuizTable initialData={initialQuizzes} />
      </TabsContent>

      <TabsContent value="user" className="mt-4">
        <TrashUserTable initialData={initialUsers} />
      </TabsContent>

      <TabsContent value="group" className="mt-4">
        <TrashGroupTable initialData={initialGroups} />
      </TabsContent>
    </Tabs>
  )
}
