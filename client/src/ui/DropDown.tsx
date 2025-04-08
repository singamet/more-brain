import { ChevronDownIcon } from "@heroicons/react/16/solid";

import clsx from "clsx";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { useRef, useState } from "react";
import { DropDownOptionType } from "../lib/types";

export default function DropDown<T extends FieldValues>({
  name,
  label,
  options,
  register,
}: {
  name: Path<T>;
  label: string;
  options: DropDownOptionType[];
  register: UseFormRegister<T>;
}) {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const selectedValue = useRef<DropDownOptionType>({ _id: "", name: "None" });

  return (
    <div className="flex flex-col gap-4">
      <label htmlFor={name} className="tracking-widest text-zinc-200">
        {label}
      </label>
      <div className="relative w-full" id={name}>
        <div
          className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-zinc-400 p-2"
          onClick={() => setIsDropDownOpen((prev) => !prev)}
        >
          <p className="px-2">{selectedValue.current.name}</p>
          <ChevronDownIcon className="h-4 w-4" />
        </div>
        {isDropDownOpen && (
          <ul className="absolute z-30 flex max-h-48 w-full flex-col overflow-y-auto">
            <li className="flex w-full rounded-t-xl border-2 border-zinc-800 bg-zinc-800 px-4 py-1 text-zinc-200 hover:bg-lime-800">
              <input
                type="radio"
                id="none"
                className="hidden"
                value=""
                {...register(name)}
                onClick={() => {
                  selectedValue.current = { _id: "", name: "None" };
                  setIsDropDownOpen(false);
                }}
              />
              <label htmlFor="none" className="w-full cursor-pointer">
                None
              </label>
            </li>
            {options.map((option, idx) => (
              <li
                key={option._id}
                className={clsx(
                  "flex w-full border-2 border-zinc-800 bg-zinc-800 px-4 py-1 text-zinc-200 hover:bg-lime-800",
                  {
                    // "rounded-t-xl": idx === 0,
                    "rounded-b-xl": idx === options.length - 1,
                  },
                )}
              >
                <input
                  type="radio"
                  id={option._id}
                  className="hidden"
                  value={option._id}
                  {...register(name)}
                  onClick={() => {
                    selectedValue.current = option;
                    setIsDropDownOpen(false);
                  }}
                />
                <label htmlFor={option._id} className="w-full cursor-pointer">
                  {option.name}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
