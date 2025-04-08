import { Link } from "react-router-dom";

export default function AppError() {
  return (
    <div className="flex h-screen w-screen flex-col gap-4 bg-gradient-to-tr from-emerald-200 via-white to-fuchsia-200 text-black md:px-4 md:py-4 lg:gap-8 lg:px-16 lg:py-8 dark:from-emerald-950 dark:via-black dark:to-fuchsia-950 dark:to-120% dark:text-white">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col">
          <div className="flex gap-2 text-5xl">
            <h1 className="font-extralight tracking-tight text-zinc-400">
              RAN INTO AN
            </h1>
            <h1 className="tracking-wider text-lime-600">ERROR</h1>
          </div>
          <Link
            to="/"
            className="flex w-full items-center justify-center rounded-lg bg-lime-600 py-2 text-lg tracking-widest transition-all duration-300 hover:bg-lime-700 hover:font-bold"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
