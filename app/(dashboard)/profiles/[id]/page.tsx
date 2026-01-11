import { notFound } from "next/navigation";
import {
  fetchProfileById,
  fetchUserQuizzes,
  fetchCreatedQuizzes,
} from "../actions";
import { ProfileView } from "./profile-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfileDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [profileResult, quizzesResult, createdQuizzesResult] =
    await Promise.all([
      fetchProfileById(id),
      fetchUserQuizzes(id),
      fetchCreatedQuizzes(id),
    ]);

  const { data: profile, error } = profileResult;
  const { data: userQuizzes } = quizzesResult;
  const { data: createdQuizzes } = createdQuizzesResult;

  if (error || !profile) {
    notFound();
  }

  return (
    <ProfileView
      profile={profile}
      userQuizzes={userQuizzes || []}
      createdQuizzes={createdQuizzes || []}
    />
  );
}
