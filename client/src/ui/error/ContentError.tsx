export default function ContentError({ error }: { error: string }) {
  return (
    <div className="mb-4 flex h-full w-full flex-col items-center rounded-xl bg-zinc-50/50 p-16 shadow-2xl transition-all duration-300 dark:bg-zinc-800/50">
      <p className="text-xl tracking-wide">{error}</p>
    </div>
  );
}
