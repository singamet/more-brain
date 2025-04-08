import { PlusIcon } from "@heroicons/react/16/solid";
import { useForm } from "react-hook-form";
import { AddCategoryType, CategoryType } from "../../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema } from "../../lib/schema";
import { useMutation } from "@tanstack/react-query";
import { addCategory } from "../../api/category";
import { useSetAtom } from "jotai";
import { categoriesAtom } from "../../atoms/app";

export default function AddCategory() {
  const token = localStorage.getItem("auth");
  const setCategories = useSetAtom(categoriesAtom);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddCategoryType>({ resolver: zodResolver(categorySchema) });
  const mutation = useMutation({
    mutationFn: (data: AddCategoryType) => addCategory(data, token as string),
    onSuccess: (data: CategoryType) => {
      setCategories((prev) => [...prev, data]);
      reset();
    },
  });
  const onSubmit = handleSubmit(async (data: AddCategoryType) => {
    mutation.mutateAsync(data);
  });
  return (
    <form
      onSubmit={onSubmit}
      className="relative flex h-16 w-full items-center justify-start gap-4 ps-12 tracking-wider"
    >
      <button
        className="cursor-pointer opacity-50"
        type="submit"
        disabled={isSubmitting}
      >
        <PlusIcon className="h-6 w-6" />
      </button>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Add New"
          className="w-11/12 opacity-50 outline-0"
          {...register("name")}
        />
        {(errors.name || mutation.isError) && (
          <div className="absolute -translate-x-8 translate-y-2 transform bg-zinc-300 px-2 py-1 text-center text-sm text-red-900 transition-all duration-300">
            {errors.name ? errors.name.message : mutation.error?.message}
            <div className="absolute top-0 right-1/2 h-2 w-2 translate-x-1/2 -translate-y-1/2 rotate-45 bg-zinc-300"></div>
          </div>
        )}
      </div>
    </form>
  );
}
