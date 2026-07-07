export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#0f1726] p-6 text-white">
      <h1 className="text-2xl font-semibold">Detalhes da coleção</h1>
      <p className="mt-2 text-sm text-slate-400">ID: {id}</p>
    </main>
  );
}
