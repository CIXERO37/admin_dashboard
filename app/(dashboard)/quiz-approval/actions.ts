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
}

interface FetchQuizApprovalsParams {
  page?: number
  limit?: number
  search?: string
}

// Dummy data for prototype
const DUMMY_QUIZZES: QuizApproval[] = [
  {
    id: "quiz_001",
    title: "Matematika Dasar: Perkalian dan Pembagian",
    description: "Quiz untuk menguji kemampuan perkalian dan pembagian siswa SD kelas 4-6",
    category: "mathematics",
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
      { question: "Berapa hasil dari 25 x 4?", answers: [{ id: "0", answer: "90" }, { id: "1", answer: "95" }, { id: "2", answer: "100" }, { id: "3", answer: "105" }], correct: "2" },
    ],
  },
  {
    id: "quiz_002",
    title: "English Vocabulary: Animals",
    description: "Test your knowledge about animal names in English",
    category: "language",
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
    questions: [
      { question: "What is the largest mammal in the world?", answers: [{ id: "0", answer: "Elephant" }, { id: "1", answer: "Blue Whale" }, { id: "2", answer: "Giraffe" }, { id: "3", answer: "Hippopotamus" }], correct: "1" },
      { question: "Which animal is known as the King of the Jungle?", answers: [{ id: "0", answer: "Tiger" }, { id: "1", answer: "Elephant" }, { id: "2", answer: "Lion" }, { id: "3", answer: "Bear" }], correct: "2" },
      { question: "What do you call a baby dog?", answers: [{ id: "0", answer: "Kitten" }, { id: "1", answer: "Cub" }, { id: "2", answer: "Puppy" }, { id: "3", answer: "Calf" }], correct: "2" },
      { question: "Which bird cannot fly?", answers: [{ id: "0", answer: "Eagle" }, { id: "1", answer: "Penguin" }, { id: "2", answer: "Sparrow" }, { id: "3", answer: "Owl" }], correct: "1" },
    ],
  },
  {
    id: "quiz_003",
    title: "Sejarah Indonesia: Kemerdekaan",
    description: "Quiz tentang sejarah kemerdekaan Indonesia",
    category: "history",
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
    questions: [
      { question: "Kapan Indonesia memproklamasikan kemerdekaan?", answers: [{ id: "0", answer: "17 Agustus 1945" }, { id: "1", answer: "17 Agustus 1944" }, { id: "2", answer: "17 Agustus 1946" }, { id: "3", answer: "17 Juli 1945" }], correct: "0" },
      { question: "Siapa yang membacakan teks proklamasi?", answers: [{ id: "0", answer: "Mohammad Hatta" }, { id: "1", answer: "Soekarno" }, { id: "2", answer: "Ahmad Subarjo" }, { id: "3", answer: "Fatmawati" }], correct: "1" },
      { question: "Di mana proklamasi kemerdekaan dibacakan?", answers: [{ id: "0", answer: "Jalan Menteng Raya" }, { id: "1", answer: "Jalan Pegangsaan Timur 56" }, { id: "2", answer: "Istana Merdeka" }, { id: "3", answer: "Gedung DPR" }], correct: "1" },
      { question: "Siapa yang menjahit bendera merah putih pertama?", answers: [{ id: "0", answer: "Kartini" }, { id: "1", answer: "Cut Nyak Dien" }, { id: "2", answer: "Fatmawati" }, { id: "3", answer: "Dewi Sartika" }], correct: "2" },
      { question: "Apa nama organisasi pemuda yang menculik Soekarno-Hatta?", answers: [{ id: "0", answer: "Sumpah Pemuda" }, { id: "1", answer: "PETA" }, { id: "2", answer: "Gerakan Pemuda" }, { id: "3", answer: "Menteng 31" }], correct: "3" },
    ],
  },
  {
    id: "quiz_004",
    title: "Science: Solar System",
    description: "Learn about planets and the solar system",
    category: "science",
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
    questions: [
      { question: "Which planet is known as the Red Planet?", answers: [{ id: "0", answer: "Venus" }, { id: "1", answer: "Mars" }, { id: "2", answer: "Jupiter" }, { id: "3", answer: "Saturn" }], correct: "1" },
      { question: "What is the largest planet in our solar system?", answers: [{ id: "0", answer: "Saturn" }, { id: "1", answer: "Neptune" }, { id: "2", answer: "Jupiter" }, { id: "3", answer: "Uranus" }], correct: "2" },
      { question: "How many planets are in our solar system?", answers: [{ id: "0", answer: "7" }, { id: "1", answer: "8" }, { id: "2", answer: "9" }, { id: "3", answer: "10" }], correct: "1" },
    ],
  },
  {
    id: "quiz_005",
    title: "Biologi: Sistem Pencernaan Manusia",
    description: "Quiz tentang organ dan proses pencernaan pada manusia",
    category: "science",
    language: "id",
    cover_image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=200&fit=crop",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    creator: {
      id: "user_005",
      fullname: "Eko Prasetyo",
      username: "ekoprasetyo",
      email: "eko.prasetyo@email.com",
      avatar_url: null,
    },
    questions: [
      { question: "Organ apa yang pertama kali mencerna makanan?", answers: [{ id: "0", answer: "Lambung" }, { id: "1", answer: "Mulut" }, { id: "2", answer: "Usus halus" }, { id: "3", answer: "Kerongkongan" }], correct: "1" },
      { question: "Enzim apa yang terdapat dalam air liur?", answers: [{ id: "0", answer: "Pepsin" }, { id: "1", answer: "Lipase" }, { id: "2", answer: "Amilase" }, { id: "3", answer: "Tripsin" }], correct: "2" },
      { question: "Di mana penyerapan nutrisi terjadi?", answers: [{ id: "0", answer: "Lambung" }, { id: "1", answer: "Usus besar" }, { id: "2", answer: "Usus halus" }, { id: "3", answer: "Kerongkongan" }], correct: "2" },
      { question: "Apa fungsi utama usus besar?", answers: [{ id: "0", answer: "Mencerna protein" }, { id: "1", answer: "Menyerap air" }, { id: "2", answer: "Memproduksi enzim" }, { id: "3", answer: "Menyimpan makanan" }], correct: "1" },
    ],
  },
  {
    id: "quiz_006",
    title: "Geography: World Capitals",
    description: "Test your knowledge of capital cities around the world",
    category: "geography",
    language: "en",
    cover_image: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=400&h=200&fit=crop",
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    creator: {
      id: "user_006",
      fullname: "Maria Garcia",
      username: "mariagarcia",
      email: "maria.garcia@email.com",
      avatar_url: null,
    },
    questions: [
      { question: "What is the capital of Japan?", answers: [{ id: "0", answer: "Osaka" }, { id: "1", answer: "Kyoto" }, { id: "2", answer: "Tokyo" }, { id: "3", answer: "Nagoya" }], correct: "2" },
      { question: "What is the capital of Australia?", answers: [{ id: "0", answer: "Sydney" }, { id: "1", answer: "Melbourne" }, { id: "2", answer: "Brisbane" }, { id: "3", answer: "Canberra" }], correct: "3" },
      { question: "What is the capital of Brazil?", answers: [{ id: "0", answer: "Rio de Janeiro" }, { id: "1", answer: "Sao Paulo" }, { id: "2", answer: "Brasilia" }, { id: "3", answer: "Salvador" }], correct: "2" },
    ],
  },
]

// Fetch quizzes pending approval (using dummy data for prototype)
export async function fetchQuizApprovals({
  page = 1,
  limit = 10,
  search = "",
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

  // Pagination
  const offset = (page - 1) * limit
  const paginatedData = filteredData.slice(offset, offset + limit)
  const totalCount = filteredData.length
  const totalPages = Math.ceil(totalCount / limit)

  return {
    data: paginatedData,
    totalCount,
    totalPages,
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
