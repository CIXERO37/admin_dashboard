"use server"

export interface QuizApproval {
  id: string
  title: string
  description?: string | null
  category?: string | null
  language?: string | null
  image_url?: string | null
  cover_image?: string | null
  questions?: unknown[]
  created_at?: string | null
  creator?: {
    id: string
    fullname: string | null
    username: string | null
    email: string | null
    avatar_url: string | null
  } | null
}

export interface QuizApprovalResponse {
  data: QuizApproval[]
  totalCount: number
  totalPages: number
  categories: string[]
}

interface FetchQuizApprovalsParams {
  page?: number
  limit?: number
  search?: string
  category?: string
}

// Dummy data for prototype
const DUMMY_QUIZZES: QuizApproval[] = [
  {
    id: "quiz_001",
    title: "Matematika Dasar: Perkalian dan Pembagian",
    description: "Quiz untuk menguji kemampuan perkalian dan pembagian siswa SD kelas 4-6",
    category: "Math",
    language: "id",
    cover_image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=200&fit=crop",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    creator: {
      id: "user_001",
      fullname: "Ahmad Rizki",
      username: "ahmadrizki",
      email: "ahmad.rizki@gmail.com",
      avatar_url: null,
    },
    questions: [
      { question: "Berapa hasil dari 12 x 8?", answers: [{ id: "0", answer: "96" }, { id: "1", answer: "86" }, { id: "2", answer: "106" }, { id: "3", answer: "76" }], correct: "0" },
      { question: "Berapa hasil dari 144 : 12?", answers: [{ id: "0", answer: "10" }, { id: "1", answer: "12" }, { id: "2", answer: "14" }, { id: "3", answer: "16" }], correct: "1" },
    ],
  },
  {
    id: "quiz_002",
    title: "English Vocabulary: Animals",
    description: "Test your knowledge about animal names in English",
    category: "General",
    language: "en",
    cover_image: "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&h=200&fit=crop",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    creator: {
      id: "user_002",
      fullname: "Sarah Johnson",
      username: "sarahj",
      email: "sarah.johnson@email.com",
      avatar_url: null,
    },
    questions: [],
  },
  {
    id: "quiz_003",
    title: "Sejarah Indonesia: Kemerdekaan",
    description: "Quiz tentang sejarah kemerdekaan Indonesia",
    category: "History",
    language: "id",
    cover_image: "https://images.unsplash.com/photo-1555217851-6141535bd771?w=400&h=200&fit=crop",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    creator: {
      id: "user_003",
      fullname: "Budi Santoso",
      username: "budisantoso",
      email: "budi.santoso@yahoo.com",
      avatar_url: null,
    },
    questions: [],
  },
  {
    id: "quiz_004",
    title: "Science: Solar System",
    description: "Learn about planets and the solar system",
    category: "Science",
    language: "en",
    cover_image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=200&fit=crop",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    creator: {
      id: "user_004",
      fullname: "Diana Putri",
      username: "dianaputri",
      email: "diana.putri@gmail.com",
      avatar_url: null,
    },
    questions: [],
  },
  {
    id: "quiz_005",
    title: "Introduction to Python Programming",
    description: "Basic concepts of Python",
    category: "Technology",
    language: "en",
    cover_image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=200&fit=crop",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    creator: {
      id: "user_005",
      fullname: "Eko Prasetyo",
      username: "ekoprasetyo",
      email: "eko.prasetyo@email.com",
      avatar_url: null,
    },
    questions: [],
  },
  {
    id: "quiz_006",
    title: "Business Strategy 101",
    description: "Fundamentals of business strategy",
    category: "Business",
    language: "en",
    cover_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    creator: {
      id: "user_006",
      fullname: "Maria Garcia",
      username: "mariagarcia",
      email: "maria.garcia@email.com",
      avatar_url: null,
    },
    questions: [],
  },
  {
    id: "quiz_007",
    title: "Football Rules & Regulations",
    description: "Do you know the rules of football?",
    category: "Sports",
    language: "en",
    cover_image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&h=200&fit=crop",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    creator: {
      id: "user_007",
      fullname: "James Wilson",
      username: "jamesw",
      email: "james.wilson@email.com",
      avatar_url: null,
    },
    questions: [],
  },
]

// Fetch quizzes pending approval (using dummy data for prototype)
export async function fetchQuizApprovals({
  page = 1,
  limit = 10,
  search = "",
  category = "all",
}: FetchQuizApprovalsParams): Promise<QuizApprovalResponse> {
  // Filter by search
  let filteredData = DUMMY_QUIZZES
  if (search) {
    const searchLower = search.toLowerCase()
    filteredData = DUMMY_QUIZZES.filter(
      (quiz) =>
        quiz.title.toLowerCase().includes(searchLower) ||
        quiz.description?.toLowerCase().includes(searchLower) ||
        quiz.creator?.fullname?.toLowerCase().includes(searchLower)
    )
  }

  // Filter by category
  if (category && category !== "all") {
    filteredData = filteredData.filter(
      (quiz) => quiz.category?.toLowerCase() === category.toLowerCase()
    )
  }

  // Extract unique categories
  const categories = [...new Set(DUMMY_QUIZZES.map((q) => q.category).filter(Boolean) as string[])].sort()

  // Pagination
  const offset = (page - 1) * limit
  const paginatedData = filteredData.slice(offset, offset + limit)
  const totalCount = filteredData.length
  const totalPages = Math.ceil(totalCount / limit)

  return {
    data: paginatedData,
    totalCount,
    totalPages,
    categories,
  }
}

// Fetch single quiz by ID (using dummy data for prototype)
export async function fetchQuizApprovalById(id: string): Promise<{ data: QuizApproval | null; error: string | null }> {
  const quiz = DUMMY_QUIZZES.find((q) => q.id === id)
  
  if (!quiz) {
    return { data: null, error: "Quiz not found" }
  }

  return { data: quiz, error: null }
}

// Approve quiz (dummy - just return success for prototype)
export async function approveQuizAction(id: string) {
  // In production, this would update the database
  console.log(`Approving quiz: ${id}`)
  return { error: null }
}

// Reject quiz (dummy - just return success for prototype)
export async function rejectQuizAction(id: string, reason?: string) {
  // In production, this would update the database
  console.log(`Rejecting quiz: ${id}, reason: ${reason}`)
  return { error: null }
}
