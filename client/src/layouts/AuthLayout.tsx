import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-lg flex-col items-center gap-4 rounded-2xl bg-zinc-700/60 p-4 shadow-xs shadow-lime-400">
        <h1 className="w-full border-b-[1px] border-b-gray-600 py-4 text-center text-4xl font-bold tracking-widest text-lime-950 dark:text-lime-400">
          More Brain
        </h1>
        <Outlet />
      </div>
    </div>
  );
}
