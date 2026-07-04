import { CollectionResponse } from "@/src/types/colecaoPagina.types";

interface HQTableProps {
  hqs: CollectionResponse["items"];
}

export default function HQTable({ hqs }: HQTableProps) {
  if (hqs.length === 0) {
    return (
      <div className="rounded-xl border border-[#28374e] bg-[#1d2a3d] p-10 text-center text-[#9fb5d1]">
        Nenhuma HQ encontrada.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#28374e] bg-[#1d2a3d]">
      <table className="w-full">
        <thead className="border-b border-[#28374e] bg-[#172234]">
          <tr className="text-left text-sm uppercase tracking-wide text-[#9fb5d1]">
            <th className="px-6 py-4">Capa</th>
            <th className="px-6 py-4">Título</th>
            <th className="px-6 py-4">Editora</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Valor Pago</th>
            <th className="px-6 py-4 text-center">Ações</th>
          </tr>
        </thead>

        <tbody>
          {hqs.map((item) => (
            <tr
              key={item.id}
              className="border-b border-[#28374e] hover:bg-[#243248] transition"
            >
              <td className="px-6 py-4">
                {item.hq.capa_url ? (
                  <img
                    src={item.hq.capa_url}
                    alt={item.hq.titulo}
                    className="h-20 w-14 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-14 items-center justify-center rounded bg-[#0f1726] text-xs text-slate-500">
                    Sem capa
                  </div>
                )}
              </td>

              <td className="px-6 py-4">
                <div className="font-semibold">
                  {item.hq.titulo}
                </div>

                {item.hq.numero_edicao && (
                  <div className="text-sm text-[#94a3b8]">
                    #{item.hq.numero_edicao}
                  </div>
                )}
              </td>

              <td className="px-6 py-4">
                {item.hq.editora?.nome ?? "-"}
              </td>

              <td className="px-6 py-4">
                {item.status}
              </td>

              <td className="px-6 py-4">
                {item.hq.valor_pago
                  ? `R$ ${Number(item.hq.valor_pago).toFixed(2)}`
                  : "-"}
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-center gap-2">
                  <button className="rounded bg-blue-600 px-3 py-1 text-sm hover:bg-blue-700">
                    Editar
                  </button>

                  <button className="rounded bg-red-600 px-3 py-1 text-sm hover:bg-red-700">
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}