"use client";

import { api } from "@/src/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/login", {
        email,
        senha,
      });

      const { token, usuario } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      router.push("/");
    } catch (error: unknown) {
      console.error(error);

      const serverErrorMessage =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined;

      alert(serverErrorMessage ?? "Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-center text-white">
          MyComicBookCollection
        </h1>

        <p className="text-center text-slate-400 mt-2">
          Entre na sua coleção
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-lg text-white font-semibold"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6">
          Não possui conta?{" "}
          <Link
            href="/cadastro"
            className="text-blue-500 hover:text-blue-400"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}