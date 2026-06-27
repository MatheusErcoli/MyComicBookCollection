"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getApiErrorMessage } from "@/src/services/api";
import { cadastrarUsuario } from "@/src/services/auth.service";

export default function CadastroPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [quandoComecou, setQuandoComecou] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await cadastrarUsuario({
        nome,
        email,
        senha,
        quando_comecou: quandoComecou,
      });

      alert("Conta criada com sucesso!");
      router.push("/login");
    } catch (error) {
      console.error(error);
      alert(getApiErrorMessage(error, "Erro ao criar conta."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-[#1E293B] rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-[#F8FAFC] text-center">
          Criar Conta
        </h1>

        <p className="text-[#94A3B8] text-center mt-2">
          Cadastre-se para comecar a organizar sua colecao de HQs
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="nome" className="block text-[#F8FAFC] mb-2">
              Nome
            </label>

            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="
                w-full
                rounded-lg
                border
                border-slate-600
                bg-slate-900
                px-4
                py-3
                text-white
                outline-none
                transition
                focus:border-[#EF4444]
              "
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[#F8FAFC] mb-2">
              E-mail
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                w-full
                rounded-lg
                border
                border-slate-600
                bg-slate-900
                px-4
                py-3
                text-white
                outline-none
                transition
                focus:border-[#EF4444]
              "
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-[#F8FAFC] mb-2">
              Senha
            </label>

            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="
                w-full
                rounded-lg
                border
                border-slate-600
                bg-slate-900
                px-4
                py-3
                text-white
                outline-none
                transition
                focus:border-[#EF4444]
              "
            />
          </div>

          <div>
            <label
              htmlFor="quando_comecou"
              className="block text-[#F8FAFC] mb-2"
            >
              Quando comecou a colecionar?
            </label>

            <input
              id="quando_comecou"
              type="date"
              value={quandoComecou}
              onChange={(e) => setQuandoComecou(e.target.value)}
              required
              className="
                w-full
                rounded-lg
                border
                border-slate-600
                bg-slate-900
                px-4
                py-3
                text-white
                outline-none
                transition
                focus:border-[#EF4444]
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-[#22C55E]
              hover:bg-green-600
              disabled:opacity-60
              disabled:cursor-not-allowed
              transition
              text-white
              py-3
              rounded-lg
              font-semibold
            "
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <p className="text-center text-[#94A3B8] mt-6">
          Ja possui conta?{" "}
          <Link href="/login" className="text-[#3B82F6] hover:text-blue-400">
            Fazer login
          </Link>
        </p>
      </div>
    </main>
  );
}
