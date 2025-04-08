export default function CategorySkeleton() {
  return (
    <div className="h-[calc(100vh-184px)] overflow-x-hidden overflow-y-auto md:h-[calc(100vh-240px)] lg:h-[calc(100vh-274px)]">
      {Array.from({ length: 6 }, (_, i) => i + 1).map((x) => (
        <div
          key={x}
          className="flex h-16 w-full animate-pulse cursor-pointer items-center justify-start gap-4 border-[1px] border-zinc-100 bg-zinc-200 ps-12 pe-4 transition-all duration-200 dark:border-zinc-900 dark:bg-zinc-800"
        ></div>
      ))}
    </div>
  );
}
