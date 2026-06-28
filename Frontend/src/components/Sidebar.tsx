"use client";

import Link from "next/link";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface SidebarProps {
  email: string;
  logout: () => void;
  router: AppRouterInstance;
  BookIcon: React.ComponentType<{ className?: string }>;
  GridIcon: React.ComponentType<{ className?: string }>;
  BarIcon: React.ComponentType<{ className?: string }>;
  ArchiveIcon: React.ComponentType<{ className?: string }>;
  HeartIcon: React.ComponentType<{ className?: string }>;
  SettingsIcon: React.ComponentType<{ className?: string }>;
  SunIcon: React.ComponentType<{ className?: string }>;
  LogoutIcon: React.ComponentType<{ className?: string }>;
}

export default function Sidebar({
  email,
  logout,
  router,
  BookIcon,
  GridIcon,
  BarIcon,
  ArchiveIcon,
  HeartIcon,
  SettingsIcon,
  SunIcon,
  LogoutIcon,
}: SidebarProps) {
  return (
    <aside className="hidden w-[244px] shrink-0 border-r border-[#253247] bg-[#0b1322] px-4 py-5 md:flex md:flex-col">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ef4444] text-white">
          <BookIcon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-base font-bold leading-tight">ComicBook</p>
          <p className="text-xs text-[#a8c4e8]">Sua coleção</p>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        <Link
          href="/"
          className="flex h-11 items-center gap-3 rounded-xl bg-[#f83f45] px-4 text-sm font-semibold text-white"
        >
          <GridIcon className="h-4 w-4" />
          Dashboard
        </Link>

        <Link
          href="/minha-colecao"
          className="flex h-11 items-center gap-3 rounded-xl px-4 text-sm font-medium text-[#9fc9ff] transition hover:bg-[#142033]"
        >
          <BarIcon className="h-4 w-4 text-[#93a4bb]" />
          Minha Coleção
        </Link>

        <Link
          href="/sagas"
          className="flex h-11 items-center gap-3 rounded-xl px-4 text-sm font-medium text-[#9fc9ff] transition hover:bg-[#142033]"
        >
          <ArchiveIcon className="h-4 w-4 text-[#93a4bb]" />
          Sagas
        </Link>

        <Link
          href="/wishlist"
          className="flex h-11 items-center gap-3 rounded-xl px-4 text-sm font-medium text-[#9fc9ff] transition hover:bg-[#142033]"
        >
          <HeartIcon className="h-4 w-4 text-[#93a4bb]" />
          Wishlist
        </Link>

        <Link
          href="/admin"
          className="flex h-11 items-center gap-3 rounded-xl px-4 text-sm font-medium text-[#9fc9ff] transition hover:bg-[#142033]"
        >
          <SettingsIcon className="h-4 w-4 text-[#93a4bb]" />
          Admin
        </Link>
      </nav>

      <div className="mt-auto border-t border-[#253247] pt-4">
        <p className="truncate text-xs text-[#9fc9ff]">{email}</p>

        <div className="mt-4 flex items-center justify-around text-[#d8e5f8]">
          <button
            type="button"
            className="rounded-lg p-2 transition hover:bg-[#142033]"
          >
            <SunIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="rounded-lg p-2 transition hover:bg-[#142033]"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            <LogoutIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}