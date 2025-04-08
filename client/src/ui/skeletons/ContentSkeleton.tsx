export default function ContentSkeleton() {
  return (
    <div className="w-full-xl mb-4 flex h-full w-full flex-1 flex-col rounded bg-zinc-50/50 p-4 shadow-2xl transition-all duration-300 dark:bg-zinc-800/50">
      <div className="flex h-16 items-center justify-between gap-2 border-b-2 border-b-zinc-200 px-4 pb-4 opacity-100 dark:border-b-zinc-800"></div>

      <div className="max-h-[calc(100vh-180px)] w-full overflow-y-auto py-4 ps-4 lg:max-h-[calc(100vh-240px)]">
        <div className="3xl:columns-4 columns-1 lg:columns-2 2xl:columns-3">
          {Array.from({ length: 2 }, (_, i) => i + 1).map((x) => (
            <div
              key={x}
              className="mb-4 flex h-64 w-xs animate-pulse break-inside-avoid flex-col justify-between gap-2 rounded-xl border-[1px] border-zinc-200 bg-zinc-100 shadow-lg dark:border-zinc-900 dark:bg-zinc-800/100"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
