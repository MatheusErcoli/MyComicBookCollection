"use client";

import { useRouter } from "next/navigation";
import { HQ } from "@/src/types/colecaoPagina.types";

interface HQCardProps {
  hq: HQ;
}

export default function HQCard({ hq }: HQCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/minha-colecao/${hq.id}`)}
      className="overflow-hidden rounded-xl border border-[#28374e] bg-[#1d2a3d] transition duration-200 hover:scale-[1.02] hover:cursor-pointer hover:border-red-500"
    >
      <div className="aspect-[2/3] bg-[#0f1726]">
        {hq.hq.capa_url ? (
          <img
            src={hq.hq.capa_url}
            alt={hq.hq.titulo}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Sem capa
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold text-white">
          {hq.hq.titulo}
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          {hq.hq.editora?.nome ?? "Sem editora"}
        </p>

        <div className="mt-3">
          <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
            {hq.status}
          </span>
        </div>
      </div>
    </div>
  );
}