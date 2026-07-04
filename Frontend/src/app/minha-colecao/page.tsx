"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/src/components/Sidebar";

import {
    BookIcon,
    GridIcon,
    BarIcon,
    ArchiveIcon,
    HeartIcon,
    SettingsIcon,
    SunIcon,
    LogoutIcon,
} from "@/src/components/icons";

import { logout } from "@/src/services/auth.service";
import { getStoredUser } from "@/src/services/auth-storage";
import { buscarMinhaColecao } from "@/src/services/colecaoPagina.service";
import { CollectionResponse } from "@/src/types/colecaoPagina.types";

const emptyCollection: CollectionResponse = {
    hqs: [],
    editoras: [],
    autores: [],
};

export default function MinhaColecaoPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [colecao, setColecao] = useState<CollectionResponse>(emptyCollection);

    useEffect(() => {
        async function carregar() {
            const usuario = getStoredUser();

            setEmail(usuario?.email ?? "");

            const data = await buscarMinhaColecao();
            setColecao(data);
        }

        carregar();
    }, []);

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
                <section className="flex-1 p-8">
                    <h1 className="text-3xl font-bold">
                        Minha Coleção
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Total de HQs: {colecao.hqs.length}
                    </p>
                </section>
            </div>
        </main>
    );
}

