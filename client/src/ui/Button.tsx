import clsx from "clsx";
import { ReactElement } from "react";

interface ButtonType {
  variant:
    | "primary"
    | "secondary"
    | "warning"
    | "menu"
    | "submit"
    | "tag"
    | "icon";
  icon?: ReactElement;
  text?: string;
  onClick?: () => void;
  className?: string;
}

export default function Button(props: ButtonType) {
  const variantStyles = {
    primary:
      "flex cursor-pointer items-center justify-center gap-2 rounded-xl border-lime-700 text-lg tracking-wider text-lime-400 transition-all duration-300 hover:font-bold lg:h-12 lg:px-4 lg:border-2 lg:bg-lime-700 lg:text-white lg:hover:bg-lime-800",
    secondary:
      "flex cursor-pointer items-center justify-center gap-2 rounded-xl border-lime-600 text-lg tracking-wider text-lime-900 dark:text-lime-400 transition-all duration-300 hover:border-lime-800 hover:font-bold lg:h-12 lg:px-4 lg:border-2 lg:dark:text-white lg:text-black",
    warning:
      "flex cursor-pointer items-center justify-center gap-2 rounded-xl text-lg tracking-wider text-red-400 transition-all duration-300 hover:border-red-800 hover:font-bold",
    menu: "flex h-16 w-full cursor-pointer items-center justify-start gap-4 ps-12 text-base tracking-wider transition-all duration-200 hover:dark:bg-zinc-800 hover:bg-zinc-200 hover:font-semibold pe-4",
    icon: "cursor-pointer hover:text-red-400 transition-all duration-200 flex items-center justify-center",
    submit:
      "my-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-lime-700 py-2 tracking-wider text-white transition-all duration-300 hover:bg-lime-800 hover:font-bold w-full",
    tag: "mr-2 mb-2 h-6 rounded-2xl bg-zinc-50 border-zinc-300 dark:border-zinc-700 border-[1px] dark:bg-zinc-900 px-2 text-xs text-fuchsia-400 dark:text-fuchsia-200 cursor-pointer",
  };
  return (
    <div
      className={clsx("group relative inline-block", {
        "w-full": props.variant === "menu",
      })}
    >
      <button
        className={`${variantStyles[props.variant]} ${props.className}`}
        onClick={props.onClick}
        type={props.variant === "submit" ? "submit" : "button"}
      >
        <div>{props.icon}</div>
        <h2
          className={clsx("overflow-hidden text-ellipsis whitespace-nowrap", {
            "hidden lg:block":
              props.variant === "primary" || props.variant === "secondary",
          })}
        >
          {props.text}
        </h2>
      </button>
      {(props.variant === "primary" || props.variant === "secondary") && (
        <div className="absolute -top-10 left-1/2 hidden w-28 -translate-x-1/2 items-center justify-center rounded bg-gray-300 px-4 py-2 text-sm text-black group-hover:flex lg:group-hover:hidden">
          {props.text}
          <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 bg-gray-300"></div>
        </div>
      )}
    </div>
  );
}
