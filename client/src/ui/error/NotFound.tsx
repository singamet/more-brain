import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col">
        <div className="flex gap-2 text-5xl">
          <h1 className="font-extrabold tracking-wider text-lime-600">404</h1>
          <h1 className="font-extralight tracking-tight text-zinc-400">
            NOT FOUND
          </h1>
        </div>
        <Link
          to="/"
          className="flex w-full items-center justify-center rounded-lg bg-lime-600 py-2 text-lg tracking-widest transition-all duration-300 hover:bg-lime-700 hover:font-bold"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
