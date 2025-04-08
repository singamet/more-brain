import { PencilIcon } from "@heroicons/react/16/solid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { categorySchema } from "../../lib/schema";
import { useEffect } from "react";
import { editCategoriesMap } from "../../lib/types";

export default function EditCategory({
  _id,
  value,
  formTrigger,
}: {
  _id: string;
  value: string;
  formTrigger: (trigger: () => Promise<boolean>) => void;
}) {
  const {
    watch,
    register,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
  });
  useEffect(() => {
    const { unsubscribe } = watch((val) => {
      if (val.name && val.name.length > 0) {
        if (val.name && val.name.length > 0) {
          editCategoriesMap.set(_id, val.name);
        }
      }
    });

    return () => unsubscribe();
  }, [watch, _id]);
  formTrigger(trigger);
  return (
    <form className="flex h-16 w-full items-center justify-start gap-4 ps-12 tracking-wider">
      <PencilIcon className="h-6 w-6" />
      <div className="relative w-full">
        <input
          type="text"
          defaultValue={value}
          className="w-11/12 opacity-50 outline-0"
          {...register("name")}
        />
        {errors.name && (
          <div className="absolute -translate-x-8 translate-y-2 transform bg-zinc-300 px-2 py-1 text-center text-sm text-red-900 transition-all duration-300">
            {errors.name.message}
            <div className="absolute top-0 right-1/2 h-2 w-2 translate-x-1/2 -translate-y-1/2 rotate-45 bg-zinc-300"></div>
          </div>
        )}
      </div>
    </form>
  );
}
