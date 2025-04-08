import { TrashIcon } from "@heroicons/react/16/solid";
import { useMutation } from "@tanstack/react-query";
import { deleteCategory } from "../../api/category";
import { useSetAtom } from "jotai";
import { categoriesAtom } from "../../atoms/app";
import { editCategoriesMap } from "../../lib/types";

export default function DeleteCategory({ _id }: { _id: string }) {
  const token = localStorage.getItem("auth");
  const setCategories = useSetAtom(categoriesAtom);
  const mutation = useMutation({
    mutationFn: () => deleteCategory(_id, token as string),
    onSuccess: () => {
      if (editCategoriesMap.has(_id)) {
        editCategoriesMap.delete(_id);
      }
      setCategories((prev) => prev.filter((c) => c._id !== _id));
    },
  });
  return (
    <button
      type="submit"
      onClick={async () => {
        await mutation.mutateAsync();
      }}
      className="cursor-pointer"
    >
      <TrashIcon className="h-4 w-4 text-red-400" />
    </button>
  );
}
