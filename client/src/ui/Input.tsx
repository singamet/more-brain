import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { useAtom } from "jotai";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { showPassword } from "../atoms/ui";

export interface InputProps<T extends FieldValues> {
  name: Path<T>;
  type: "text" | "password" | "email";
  label: string;
  register: UseFormRegister<T>;
  error?: string;
}

const Input = <T extends FieldValues>({
  name,
  type,
  label,
  register,
  error,
}: InputProps<T>) => {
  const [isPasswordVisible, setIsPasswordVisible] = useAtom(showPassword);
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={name} className="tracking-widest text-zinc-200">
        {label}
      </label>
      <div className="relative w-full">
        <input
          type={
            type === "password"
              ? isPasswordVisible
                ? "text"
                : "password"
              : type
          }
          {...register(name)}
          id={name}
          name={name}
          className="w-full border-b-2 border-b-zinc-400 px-2 py-1 text-lg outline-none"
        />
        {error && (
          <div className="absolute bottom-12 left-1/4 translate-x-1/3 transform bg-zinc-200 px-2 py-1 text-center text-sm text-red-900 transition-all duration-300">
            {error}
            <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 bg-zinc-200"></div>
          </div>
        )}
        {type === "password" && (
          <span
            className="absolute top-2 right-2 cursor-pointer text-zinc-400"
            onClick={() => setIsPasswordVisible((prev) => !prev)}
          >
            {isPasswordVisible ? (
              <EyeSlashIcon className="h-6 w-6" />
            ) : (
              <EyeIcon className="h-6 w-6" />
            )}
          </span>
        )}
      </div>
    </div>
  );
};
export default Input;
