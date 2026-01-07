"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// --- Types ---
export type Locale = "en" | "id";

type Dictionary = Record<string, string>;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

// --- Dictionaries ---
const dictionaries: Record<Locale, Dictionary> = {
  en: {
    // Sidebar Navigation
    "nav.dashboard": "Dashboard",
    "nav.support": "Support",
    "nav.billing": "Billing",
    "nav.master_data": "Master Data",
    "nav.users": "Users",
    "nav.trash_bin": "Trash Bin",
    "nav.administrator": "Administrator",
    "nav.settings": "Settings",
    "nav.quizzes": "Quizzes",
    "nav.reports": "Reports",
    "nav.quiz_approval": "Quiz Approval",
    "nav.groups": "Groups",
    "nav.address": "Address",
    "nav.subscriptions": "Subscriptions",
    "nav.country": "Country",
    "nav.state": "State",
    "nav.city": "City",
    "nav.appearance": "Appearance",
    "nav.collapse": "Collapse",

    // Header
    "header.my_account": "My Account",
    "header.profile": "Profile",
    "header.settings": "Settings",
    "header.logout": "Logout",
    "header.cancel": "Cancel",
    "header.logout_title": "Logout?",
    "header.logout_desc": "You will be logged out from the admin dashboard.",

    // Page Titles
    "page.dashboard": "Dashboard",
    "page.global_dashboard": "Global Dashboard",
    "page.support_dashboard": "Support Dashboard",
    "page.administrator_dashboard": "Administrator Dashboard",
    "page.master_dashboard": "Master Data Dashboard",
    "page.users": "User Data",
    "page.quizzes": "Quiz Data",
    "page.reports": "Reports",
    "page.groups": "Groups",
    "page.quiz_approval": "Quiz Approval",
    "page.trash_bin": "Trash Bin",

    // Common Actions
    "action.search": "Search...",
    "action.filter": "Filter",
    "action.add": "Add",
    "action.edit": "Edit",
    "action.delete": "Delete",
    "action.save": "Save",
    "action.cancel": "Cancel",
    "action.confirm": "Confirm",
    "action.close": "Close",
    "action.view": "View",
    "action.view_details": "View Details",
    "action.approve": "Approve",
    "action.reject": "Reject",
    "action.block": "Block",
    "action.unblock": "Unblock",
    "action.restore": "Restore",

    // Table Headers
    "table.name": "Name",
    "table.email": "Email",
    "table.status": "Status",
    "table.role": "Role",
    "table.created": "Created",
    "table.actions": "Actions",
    "table.title": "Title",
    "table.creator": "Creator",
    "table.category": "Category",
    "table.questions": "Questions",
    "table.visibility": "Visibility",
    "table.members": "Members",

    // Status
    "status.active": "Active",
    "status.blocked": "Blocked",
    "status.pending": "Pending",
    "status.in_progress": "In Progress",
    "status.resolved": "Resolved",
    "status.public": "Public",
    "status.private": "Private",

    // Filters
    "filter.all": "All",
    "filter.all_status": "All Status",
    "filter.all_visibility": "All Visibility",
    "filter.all_categories": "All Categories",

    // Stats
    "stats.total_users": "Total Users",
    "stats.total_quizzes": "Total Quizzes",
    "stats.total_reports": "Total Reports",
    "stats.pending_approvals": "Pending Approvals",
    "stats.active_groups": "Active Groups",

    // Time Ranges
    "time.today": "Today",
    "time.this_week": "This Week",
    "time.this_month": "This Month",
    "time.this_year": "This Year",
    "time.all_time": "All Time",

    // Messages
    "msg.no_data": "No data available",
    "msg.loading": "Loading...",
  },
  id: {
    // Sidebar Navigation
    "nav.dashboard": "Dasbor",
    "nav.support": "Dukungan",
    "nav.billing": "Tagihan",
    "nav.master_data": "Data Master",
    "nav.users": "Pengguna",
    "nav.trash_bin": "Tempat Sampah",
    "nav.administrator": "Administrator",
    "nav.settings": "Pengaturan",
    "nav.quizzes": "Kuis",
    "nav.reports": "Laporan",
    "nav.quiz_approval": "Persetujuan Kuis",
    "nav.groups": "Grup",
    "nav.address": "Alamat",
    "nav.subscriptions": "Langganan",
    "nav.country": "Negara",
    "nav.state": "Provinsi",
    "nav.city": "Kota",
    "nav.appearance": "Tampilan",
    "nav.collapse": "Lipat",

    // Header
    "header.my_account": "Akun Saya",
    "header.profile": "Profil",
    "header.settings": "Pengaturan",
    "header.logout": "Keluar",
    "header.cancel": "Batal",
    "header.logout_title": "Keluar?",
    "header.logout_desc": "Anda akan keluar dari dasbor admin.",

    // Page Titles
    "page.dashboard": "Dasbor",
    "page.global_dashboard": "Dasbor Global",
    "page.support_dashboard": "Dasbor Dukungan",
    "page.administrator_dashboard": "Dasbor Administrator",
    "page.master_dashboard": "Dasbor Data Master",
    "page.users": "Data Pengguna",
    "page.quizzes": "Data Kuis",
    "page.reports": "Laporan",
    "page.groups": "Grup",
    "page.quiz_approval": "Persetujuan Kuis",
    "page.trash_bin": "Tempat Sampah",

    // Common Actions
    "action.search": "Cari...",
    "action.filter": "Filter",
    "action.add": "Tambah",
    "action.edit": "Edit",
    "action.delete": "Hapus",
    "action.save": "Simpan",
    "action.cancel": "Batal",
    "action.confirm": "Konfirmasi",
    "action.close": "Tutup",
    "action.view": "Lihat",
    "action.view_details": "Lihat Detail",
    "action.approve": "Setujui",
    "action.reject": "Tolak",
    "action.block": "Blokir",
    "action.unblock": "Buka Blokir",
    "action.restore": "Pulihkan",

    // Table Headers
    "table.name": "Nama",
    "table.email": "Email",
    "table.status": "Status",
    "table.role": "Peran",
    "table.created": "Dibuat",
    "table.actions": "Aksi",
    "table.title": "Judul",
    "table.creator": "Pembuat",
    "table.category": "Kategori",
    "table.questions": "Pertanyaan",
    "table.visibility": "Visibilitas",
    "table.members": "Anggota",

    // Status
    "status.active": "Aktif",
    "status.blocked": "Diblokir",
    "status.pending": "Tertunda",
    "status.in_progress": "Dalam Proses",
    "status.resolved": "Selesai",
    "status.public": "Publik",
    "status.private": "Pribadi",

    // Filters
    "filter.all": "Semua",
    "filter.all_status": "Semua Status",
    "filter.all_visibility": "Semua Visibilitas",
    "filter.all_categories": "Semua Kategori",

    // Stats
    "stats.total_users": "Total Pengguna",
    "stats.total_quizzes": "Total Kuis",
    "stats.total_reports": "Total Laporan",
    "stats.pending_approvals": "Menunggu Persetujuan",
    "stats.active_groups": "Grup Aktif",

    // Time Ranges
    "time.today": "Hari Ini",
    "time.this_week": "Minggu Ini",
    "time.this_month": "Bulan Ini",
    "time.this_year": "Tahun Ini",
    "time.all_time": "Semua Waktu",

    // Messages
    "msg.no_data": "Tidak ada data",
    "msg.loading": "Memuat...",
  },
};

// --- Context ---
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// --- Provider ---
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Load saved locale from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("app-locale") as Locale;
    if (saved && (saved === "en" || saved === "id")) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("app-locale", newLocale);
  };

  const t = (key: string): string => {
    return dictionaries[locale][key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

// --- Hook ---
export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
