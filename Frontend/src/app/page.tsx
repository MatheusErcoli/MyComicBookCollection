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
import {
  BookIcon,
  GridIcon,
  BarIcon,
  CheckIcon,
  HeartIcon,
  StarIcon,
  DollarIcon,
  ArchiveIcon,
  SettingsIcon,
  SunIcon,
  LogoutIcon,
} from "@/src/components/icons";

const emptyResumo: DashboardResumo = {
  totalHQs: 0,
  lidas: 0,
  lendo: 0,
  naoLidas: 0,
  wishlist: 0,
};


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
