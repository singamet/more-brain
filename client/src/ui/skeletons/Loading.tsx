export default function Loading() {
  return (
    <div className="flex h-screen w-screen flex-col gap-4 bg-gradient-to-tr from-emerald-200 via-white to-fuchsia-200 text-black md:px-4 md:py-4 lg:gap-8 lg:px-16 lg:py-8 dark:from-emerald-950 dark:via-black dark:to-fuchsia-950 dark:to-120% dark:text-white">
      <div className="flex h-12 items-center justify-between rounded-xl bg-zinc-50/50 p-4 shadow-xl md:h-16 dark:bg-zinc-800/50"></div>
      <main className="flex h-[calc(100vh-64px)] flex-1 gap-2 px-4 md:h-[calc(100vh-96px)] md:gap-4 md:px-0 lg:h-full lg:gap-8">
        <div className="fixed z-10 flex h-[calc(100vh-64px)] w-0 flex-col rounded-xl bg-zinc-50/50 shadow-2xl transition-all duration-300 md:relative md:z-0 md:h-full md:w-64 dark:bg-zinc-900 md:dark:bg-zinc-800/50"></div>
        <div className="w-full-xl mb-4 flex h-full w-full flex-1 flex-col rounded bg-zinc-50/50 p-4 shadow-2xl transition-all duration-300 dark:bg-zinc-800/50">
          <div className="flex h-16 items-center justify-between gap-2 border-b-2 border-b-zinc-200 px-4 pb-4 opacity-100 dark:border-b-zinc-800"></div>

          <div className="max-h-[calc(100vh-180px)] w-full overflow-y-auto py-4 ps-4 lg:max-h-[calc(100vh-240px)]">
            <div className="3xl:columns-4 columns-1 lg:columns-2 2xl:columns-3">
              {Array.from({ length: 8 }, (_, i) => i + 1).map((x) => (
                <div
                  key={x}
                  className="mb-4 flex h-64 w-xs animate-pulse break-inside-avoid flex-col justify-between gap-2 rounded-xl border-[1px] border-zinc-200 bg-zinc-100 shadow-lg dark:border-zinc-900 dark:bg-zinc-800/100"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
