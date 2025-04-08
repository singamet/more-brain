import { CubeTransparentIcon } from "@heroicons/react/16/solid";
import Button from "../../ui/Button";
import { CategoryType } from "../../lib/types";
import { useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { categoriesAtom, editCategoriesAtom } from "../../atoms/app";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getSharedCategories } from "../../api/category";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import DeleteCategory from "./DeleteCategory";
import clsx from "clsx";
import { useParams, useSearchParams } from "react-router-dom";
import Icon from "../../ui/Icon";
import CategorySkeleton from "../../ui/skeletons/CategorySkeleton";

export default function Categories({
  formTrigger,
  isVisitor,
}: {
  formTrigger: (trigger: () => Promise<boolean>) => void;
  isVisitor: boolean;
}) {
  const { hash } = useParams();
  const [categories, setCategories] = useAtom(categoriesAtom);
  const editCategories = useAtomValue(editCategoriesAtom);
  const token = localStorage.getItem("auth");
  const query = useQuery({
    queryKey: ["categories", token],
    queryFn: () =>
      isVisitor
        ? getSharedCategories(hash as string)
        : getCategories(token as string),
    enabled: !!(isVisitor ? hash : token),
  });
  const [categoryParams, setCategoryParams] = useSearchParams();
  const currentCategory = categoryParams.get("category");
  const changeCategory = (category: string) => {
    if (category) {
      setCategoryParams({ category });
    } else {
      const params = new URLSearchParams(categoryParams);
      params.delete("category");
      setCategoryParams(params);
    }
  };
  useEffect(() => {
    if (query.isSuccess) {
      setCategories(
        query.data.map((c: CategoryType) => {
          return {
            _id: c._id,
            name: c.name,
            isPreset: c.isPreset,
          };
        }),
      );
    } else if (query.isError) {
      setCategories([]);
    }
  }, [query.data, query.isError, query.isSuccess, setCategories]);

  if (query.isLoading || query.isFetching || query.isPending || !categories) {
    return <CategorySkeleton />;
  }
  return (
    <div className="relative h-[calc(100vh-184px)] overflow-x-hidden overflow-y-auto md:h-[calc(100vh-240px)] lg:h-[calc(100vh-274px)]">
      {categories && categories.length > 0 && (
        <Button
          variant="menu"
          text="All"
          icon={<CubeTransparentIcon className="h-6 w-6 text-lime-500" />}
          onClick={() => changeCategory("")}
          className={clsx({ "bg-zinc-200 dark:bg-zinc-800": !currentCategory })}
        />
      )}
      {categories &&
        categories.length > 0 &&
        categories.map((category) =>
          editCategories ? (
            category.isPreset ? (
              <Button
                variant="menu"
                icon={<Icon type={category.name} />}
                text={category.name}
                onClick={() => {}}
                key={category._id}
              />
            ) : (
              !isVisitor && (
                <div key={category._id} className="flex items-center pe-2">
                  <EditCategory
                    _id={category._id}
                    value={category.name}
                    formTrigger={formTrigger}
                  />
                  <DeleteCategory _id={category._id} />
                </div>
              )
            )
          ) : (
            <Button
              variant="menu"
              key={category._id}
              icon={<Icon type={category.name} />}
              text={category.name}
              onClick={() => changeCategory(category._id)}
              className={clsx({
                "bg-zinc-200 dark:bg-zinc-800":
                  category._id === currentCategory,
              })}
            />
          ),
        )}
      {!isVisitor && <AddCategory />}
    </div>
  );
}
