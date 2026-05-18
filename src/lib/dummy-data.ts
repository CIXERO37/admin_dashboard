// Support Data
export const supportReports = [
  {
    id: 1,
    user: "John Doe",
    email: "john@example.com",
    type: "Bug Report",
    status: "Pending",
    date: "2024-01-15",
    priority: "High",
  },
  {
    id: 2,
    user: "Jane Smith",
    email: "jane@example.com",
    type: "Feature Request",
    status: "In Progress",
    date: "2024-01-14",
    priority: "Medium",
  },
  {
    id: 3,
    user: "Bob Wilson",
    email: "bob@example.com",
    type: "Account Issue",
    status: "Resolved",
    date: "2024-01-13",
    priority: "Low",
  },
  {
    id: 4,
    user: "Alice Brown",
    email: "alice@example.com",
    type: "Payment Issue",
    status: "Pending",
    date: "2024-01-12",
    priority: "High",
  },
  {
    id: 5,
    user: "Charlie Davis",
    email: "charlie@example.com",
    type: "Bug Report",
    status: "In Progress",
    date: "2024-01-11",
    priority: "Medium",
  },
]

export const reportedQuizzes = [
  {
    id: 1,
    quizTitle: "Math Basics",
    reporter: "user123",
    reason: "Incorrect Answer",
    status: "Under Review",
    date: "2024-01-15",
  },
  {
    id: 2,
    quizTitle: "Science Quiz",
    reporter: "user456",
    reason: "Offensive Content",
    status: "Resolved",
    date: "2024-01-14",
  },
  { id: 3, quizTitle: "History Test", reporter: "user789", reason: "Duplicate", status: "Pending", date: "2024-01-13" },
  {
    id: 4,
    quizTitle: "Geography Quiz",
    reporter: "user321",
    reason: "Spam",
    status: "Under Review",
    date: "2024-01-12",
  },
]

// Billing Data
export const activeSubscribers = [
  {
    id: 1,
    name: "Tech Corp",
    email: "billing@techcorp.com",
    plan: "Enterprise",
    amount: "$299/mo",
    nextBilling: "2024-02-01",
    status: "Active",
  },
  {
    id: 2,
    name: "Startup Inc",
    email: "finance@startup.io",
    plan: "Pro",
    amount: "$99/mo",
    nextBilling: "2024-02-05",
    status: "Active",
  },
  {
    id: 3,
    name: "Agency Plus",
    email: "accounts@agency.com",
    plan: "Business",
    amount: "$199/mo",
    nextBilling: "2024-02-10",
    status: "Active",
  },
  {
    id: 4,
    name: "Solo Dev",
    email: "dev@solo.dev",
    plan: "Starter",
    amount: "$29/mo",
    nextBilling: "2024-02-15",
    status: "Active",
  },
]

export const unpaidUsers = [
  {
    id: 1,
    name: "Pending Co",
    email: "info@pending.co",
    amount: "$99",
    dueDate: "2024-01-10",
    daysPast: 5,
    plan: "Pro",
  },
  {
    id: 2,
    name: "Late LLC",
    email: "billing@late.llc",
    amount: "$299",
    dueDate: "2024-01-05",
    daysPast: 10,
    plan: "Enterprise",
  },
  {
    id: 3,
    name: "Overdue Inc",
    email: "pay@overdue.inc",
    amount: "$199",
    dueDate: "2024-01-01",
    daysPast: 14,
    plan: "Business",
  },
]

// Master Data
export const quizData = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    category: "Programming",
    questions: 25,
    difficulty: "Intermediate",
    status: "Active",
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    title: "React Basics",
    category: "Programming",
    questions: 20,
    difficulty: "Beginner",
    status: "Active",
    createdAt: "2024-01-05",
  },
  {
    id: 3,
    title: "World Geography",
    category: "Geography",
    questions: 30,
    difficulty: "Easy",
    status: "Draft",
    createdAt: "2024-01-08",
  },
  {
    id: 4,
    title: "Ancient History",
    category: "History",
    questions: 40,
    difficulty: "Advanced",
    status: "Active",
    createdAt: "2024-01-10",
  },
  {
    id: 5,
    title: "Biology 101",
    category: "Science",
    questions: 35,
    difficulty: "Intermediate",
    status: "Active",
    createdAt: "2024-01-12",
  },
]

export const countryData = [
  { id: 1, code: "US", name: "United States", region: "North America", users: 15420, status: "Active" },
  { id: 2, code: "GB", name: "United Kingdom", region: "Europe", users: 8350, status: "Active" },
  { id: 3, code: "JP", name: "Japan", region: "Asia", users: 6200, status: "Active" },
  { id: 4, code: "DE", name: "Germany", region: "Europe", users: 5800, status: "Active" },
  { id: 5, code: "ID", name: "Indonesia", region: "Asia", users: 4500, status: "Active" },
]

export const provinceData = [
  { id: 1, name: "California", country: "United States", code: "CA", cities: 482, users: 4200 },
  { id: 2, name: "Texas", country: "United States", code: "TX", cities: 350, users: 3100 },
  { id: 3, name: "England", country: "United Kingdom", code: "ENG", cities: 314, users: 5200 },
  { id: 4, name: "Tokyo", country: "Japan", code: "TYO", cities: 62, users: 2800 },
  { id: 5, name: "Bavaria", country: "Germany", code: "BY", cities: 71, users: 1500 },
  { id: 6, name: "West Java", country: "Indonesia", code: "JB", cities: 27, users: 1200 },
]

// Administrator Data
export const adminUsers = [
  {
    id: 1,
    name: "Admin Master",
    email: "admin@saas.com",
    role: "Super Admin",
    status: "Active",
    lastLogin: "2024-01-15 10:30",
    permissions: "Full Access",
  },
  {
    id: 2,
    name: "Sarah Manager",
    email: "sarah@saas.com",
    role: "Manager",
    status: "Active",
    lastLogin: "2024-01-15 09:15",
    permissions: "Limited",
  },
  {
    id: 3,
    name: "Mike Support",
    email: "mike@saas.com",
    role: "Support",
    status: "Active",
    lastLogin: "2024-01-14 16:45",
    permissions: "Support Only",
  },
  {
    id: 4,
    name: "Lisa Billing",
    email: "lisa@saas.com",
    role: "Billing",
    status: "Inactive",
    lastLogin: "2024-01-10 11:20",
    permissions: "Billing Only",
  },
]

// Dashboard Stats
export const globalStats = {
  totalUsers: 45892,
  activeSubscribers: 12456,
  monthlyRevenue: 285400,
  pendingReports: 23,
  totalQuizzes: 1250,
  totalCountries: 195,
  totalProvinces: 4200,
  totalAdmins: 8,
}

export const revenueData = [
  { month: "Jan", revenue: 45000, users: 1200 },
  { month: "Feb", revenue: 52000, users: 1350 },
  { month: "Mar", revenue: 48000, users: 1180 },
  { month: "Apr", revenue: 61000, users: 1520 },
  { month: "May", revenue: 55000, users: 1400 },
  { month: "Jun", revenue: 67000, users: 1680 },
]

export const recentActivity = [
  { id: 1, action: "New subscription", user: "Tech Corp", time: "2 minutes ago", type: "billing" },
  { id: 2, action: "Report submitted", user: "John Doe", time: "15 minutes ago", type: "support" },
  { id: 3, action: "Quiz created", user: "Admin", time: "1 hour ago", type: "content" },
  { id: 4, action: "User registered", user: "New User", time: "2 hours ago", type: "user" },
  { id: 5, action: "Payment received", user: "Startup Inc", time: "3 hours ago", type: "billing" },
]
