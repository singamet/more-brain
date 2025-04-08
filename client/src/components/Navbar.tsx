import { Link } from "react-router-dom";
import Search from "./Search";

export default function Navbar() {
  return (
    <div className="flex h-12 items-center justify-between rounded-xl bg-zinc-50/50 p-4 shadow-xl md:h-16 dark:bg-zinc-800/50">
      <Link
        to="/"
        className="text-2xl font-bold tracking-widest text-lime-800 md:text-4xl dark:text-lime-400"
      >
        More Brain
      </Link>
      <Search />
    </div>
  );
}
