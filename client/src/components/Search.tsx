import {
  MagnifyingGlassIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import clsx from "clsx";
import { useAtom, useAtomValue } from "jotai";
import { searchBar, smallScreen } from "../atoms/ui";
import { searchQueryAtom } from "../atoms/app";

export default function Search() {
  const [isSearchBarOpen, setIsSearchBarOpen] = useAtom(searchBar);
  const isSmallScreen = useAtomValue(smallScreen);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);

  return (
    <div className="flex w-full flex-1">
      <div
        className={clsx(
          "ms-auto flex h-8 items-center rounded-xl bg-white px-1 transition-all duration-200 md:h-10 md:w-4/5 lg:w-1/2 xl:w-1/3 dark:text-black",
          {
            "w-[calc(100%-48px)] opacity-100": isSearchBarOpen && isSmallScreen,
            "w-0 translate-x-8 opacity-0": !isSearchBarOpen && isSmallScreen,
          },
        )}
      >
        <MagnifyingGlassIcon className="h-8 w-8" />
        <input
          type="text"
          className="h-full w-full p-2 text-sm outline-none md:text-base dark:placeholder-gray-600"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <XMarkIcon
          className="h-6 w-6 cursor-pointer text-gray-500 md:h-8 md:w-8"
          onClick={() => setSearchQuery("")}
        />
      </div>
      {!isSearchBarOpen && (
        <MagnifyingGlassIcon
          className="ms-auto h-8 w-8 cursor-pointer"
          onClick={() => setIsSearchBarOpen(true)}
        />
      )}
      {isSmallScreen && isSearchBarOpen && (
        <XCircleIcon
          className="h-8 w-8 cursor-pointer bg-transparent text-black dark:text-white"
          onClick={() => setIsSearchBarOpen(false)}
        />
      )}
    </div>
  );
}
