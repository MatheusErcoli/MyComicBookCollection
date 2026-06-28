"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getApiErrorMessage } from "@/src/services/api";
import { getAuthToken, getStoredUser } from "@/src/services/auth-storage";
import { logout } from "@/src/services/auth.service";
import { buscarResumoDashboard } from "@/src/services/dashboard.service";
import { DashboardResumo } from "@/src/types/dashboard.types";
import Sidebar from "@/src/components/Sidebar";

type IconProps = {
  className?: string;
};

const emptyResumo: DashboardResumo = {
  totalHQs: 0,
  lidas: 0,
  lendo: 0,
  naoLidas: 0,
  wishlist: 0,
};

function BookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z" />
      <path d="M8 2v15" />
    </svg>
  );
}

function GridIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function BarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M4 19V5" />
      <path d="M9 19V9" />
      <path d="M14 19v-7" />
      <path d="M19 19V7" />
    </svg>
  );
}

function CheckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

function HeartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6z" />
    </svg>
  );
}

function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1L12 2z" />
    </svg>
  );
}

function DollarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M12 2v20" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function ArchiveIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M6 7v13h12V7" />
      <path d="M8 3h8l2 4H6l2-4z" />
      <path d="M10 12h4" />
    </svg>
  );
}

function SettingsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 0 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.3 7A2 2 0 0 1 7.1 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 0 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1a2 2 0 0 1 0 4H21a1.7 1.7 0 0 0-1.6 1z" />
    </svg>
  );
}

function SunIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.9 4.9 1.4 1.4" />
      <path d="m17.7 17.7 1.4 1.4" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m4.9 19.1 1.4-1.4" />
      <path d="m17.7 6.3 1.4-1.4" />
    </svg>
  );
}

function LogoutIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M21 19V5a2 2 0 0 0-2-2h-4" />
    </svg>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [resumo, setResumo] = useState<DashboardResumo>(emptyResumo);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      router.push("/login");
      return;
    }

    async function carregarDashboard() {
      await Promise.resolve();

      const usuario = getStoredUser();
      setEmail(usuario?.email ?? "");

      try {
        const data = await buscarResumoDashboard();
        setResumo(data);
      } catch (err) {
        setError(getApiErrorMessage(err, "Nao foi possivel carregar o dashboard."));
      } finally {
        setLoading(false);
      }
    }

    carregarDashboard();
  }, [router]);

  const cards = useMemo(
    () => [
      {
        label: "Na colecao",
        value: resumo.totalHQs,
        icon: BarIcon,
        color: "text-blue-500",
      },
      {
        label: "Lidos",
        value: resumo.lidas,
        icon: CheckIcon,
        color: "text-emerald-500",
      },
      {
        label: "Lendo",
        value: resumo.lendo,
        icon: BookIcon,
        color: "text-blue-400",
      },
      {
        label: "Nao lidos",
        value: resumo.naoLidas,
        icon: BookIcon,
        color: "text-slate-400",
      },
      {
        label: "Wishlist",
        value: resumo.wishlist,
        icon: HeartIcon,
        color: "text-red-500",
      },
      {
        label: "Media de notas",
        value: "0.0",
        icon: StarIcon,
        color: "text-yellow-400",
      },
      {
        label: "Investido",
        value: "R$ 0.00",
        icon: DollarIcon,
        color: "text-emerald-500",
      },
    ],
    [resumo]
  );

  return (
    <main className="min-h-screen bg-[#0f1726] text-white">
      <div className="flex min-h-screen">
        <Sidebar
          email={email}
          logout={logout}
          router={router}
          BookIcon={BookIcon}
          GridIcon={GridIcon}
          BarIcon={BarIcon}
          ArchiveIcon={ArchiveIcon}
          HeartIcon={HeartIcon}
          SettingsIcon={SettingsIcon}
          SunIcon={SunIcon}
          LogoutIcon={LogoutIcon}
        />

        <section className="flex-1 px-5 py-6 md:px-8 lg:px-8">
          <header>
            <h1 className="text-[32px] font-bold leading-tight tracking-normal text-white">
              Dashboard
            </h1>
            <p className="mt-1 text-base text-[#a8c4e8]">Resumo da sua colecao</p>
          </header>

          {error ? (
            <div className="mt-8 rounded-xl border border-red-900/60 bg-red-950/30 px-5 py-4 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.label}
                  className="h-[110px] rounded-xl border border-[#28374e] bg-[#1d2a3d] px-4 py-4 shadow-sm"
                >
                  <Icon className={`h-5 w-5 ${card.color}`} />
                  <p className="mt-3 text-[28px] font-bold leading-none text-white">
                    {loading ? "-" : card.value}
                  </p>
                  <p className="mt-2 text-sm leading-none text-[#a8c4e8]">{card.label}</p>
                </article>
              );
            })}
          </div>

          <section className="mt-8">
            <h2 className="text-2xl font-bold text-white">Ultimas adicionadas</h2>

            <div className="mt-4 flex min-h-[122px] items-center justify-center rounded-xl border border-[#28374e] bg-[#1d2a3d] px-5 text-center">
              <p className="text-base text-[#a8c4e8]">
                Nenhuma HQ na sua colecao ainda. Va em{" "}
                <Link href="/minha-colecao" className="text-[#2f87ff] hover:text-[#61a5ff]">
                  Minha Colecao
                </Link>{" "}
                para comecar.
              </p>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
