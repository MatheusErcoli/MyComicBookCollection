"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", Icon: GridIcon },
    { href: "/minha-colecao", label: "Minha Coleção", Icon: BarIcon },
    { href: "/sagas", label: "Sagas", Icon: ArchiveIcon },
    { href: "/wishlist", label: "Wishlist", Icon: HeartIcon },
    { href: "/admin", label: "Admin", Icon: SettingsIcon },
  ];

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
        {links.map(({ href, label, Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname?.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={
                isActive
                  ? "flex h-11 items-center gap-3 rounded-xl bg-[#f83f45] px-4 text-sm font-semibold text-white"
                  : "flex h-11 items-center gap-3 rounded-xl px-4 text-sm font-medium text-[#9fc9ff] transition hover:bg-[#142033]"
              }
            >
              <Icon
                className={`h-4 w-4 ${isActive ? "" : "text-[#93a4bb]"}`}
              />
              {label}
            </Link>
          );
        })}
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