import { notFound } from "next/navigation";

import {
  fetchProfileById,
  fetchUserQuizzes,
  fetchCreatedQuizzes,
  fetchUserGameActivity,
} from "../actions";
import { UserDetailClient } from "./user-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfileDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [profileResult, quizzesResult, createdQuizzesResult, gameActivityResult] =
    await Promise.all([
      fetchProfileById(id),
      fetchUserQuizzes(id),
      fetchCreatedQuizzes(id),
      fetchUserGameActivity(id),
    ]);

  const { data: profile, error } = profileResult;
  const { data: userQuizzes } = quizzesResult;
  const { data: createdQuizzes } = createdQuizzesResult;
  const { data: gameActivity } = gameActivityResult;

  if (error || !profile) {
    notFound();
  }

  return (
    <UserDetailClient
      profile={profile}
      userQuizzes={userQuizzes || []}
      createdQuizzes={createdQuizzes || []}
      gameActivity={gameActivity}
    />
  );
}
