import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { sidebar, smallScreen } from "../atoms/ui";
import {
  Bars3Icon,
  BookmarkIcon,
  PencilSquareIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import clsx from "clsx";
import Categories from "./category/Categories";
import { categoriesAtom, editCategoriesAtom } from "../atoms/app";
import { useMutation } from "@tanstack/react-query";
import { renameCategories } from "../api/category";
import { CategoryType, editCategoriesMap } from "../lib/types";
import { useRef } from "react";
import { UseFormTrigger } from "react-hook-form";
import SignOut from "./SignOut";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function Sidebar({ isVisitor }: { isVisitor: boolean }) {
  const [isSideBarOpen, setIsSideBarOpen] = useAtom(sidebar);
  const isSmallScreen = useAtomValue(smallScreen);
  const [editCategories, setEditCategories] = useAtom(editCategoriesAtom);

  const setCategories = useSetAtom(categoriesAtom);
  const token = localStorage.getItem("auth");
  const formTriggerRefs = useRef<
    UseFormTrigger<{
      name: string;
    }>[]
  >([]);
  const editMutation = useMutation({
    mutationFn: () => renameCategories(editCategoriesMap, token as string),

    onSuccess: (data: CategoryType[]) => {
      const dataMap = new Map(data.map((x) => [x._id, x.name]));

      setCategories((prev) => {
        return prev.map((c) => {
          const val = dataMap.get(c._id);

          if (val) {
            return {
              ...c,
              name: val,
            };
          } else return c;
        });
      });
    },
    onSettled: () => {
      editCategoriesMap.clear();
      setEditCategories(false);
    },
  });
  const save = async () => {
    const allValid = await Promise.all(
      formTriggerRefs.current.map((trigger) => trigger()),
    );
    if (!allValid.every((valid) => valid)) {
      console.log("Validation erroor");
      return;
    }
    if (editCategoriesMap.size > 0) {
      editMutation.mutateAsync();
    } else {
      setEditCategories(false);
    }
  };

  return (
    <>
      <div
        className={clsx(
          "fixed z-10 flex h-[calc(100vh-64px)] flex-col rounded-xl bg-zinc-50/50 shadow-2xl transition-all duration-300 md:relative md:z-0 md:h-full dark:bg-zinc-900 md:dark:bg-zinc-800/50",
          {
            "w-0 opacity-0": !isSideBarOpen,
            "w-64 opacity-100": isSideBarOpen,
          },
        )}
      >
        <div className="flex h-8 w-full items-center justify-end gap-2 px-2">
          {!isVisitor && (
            <>
              {editCategories ? (
                <BookmarkIcon
                  className="h-6 w-6 cursor-pointer"
                  onClick={save}
                />
              ) : (
                <PencilSquareIcon
                  className="h-6 w-6 cursor-pointer"
                  onClick={() => setEditCategories(true)}
                />
              )}
            </>
          )}

          {isSmallScreen && (
            <XMarkIcon
              className="h-8 w-8 cursor-pointer"
              onClick={() => setIsSideBarOpen(false)}
            />
          )}
        </div>
        <div className="mt-4 flex w-full flex-1 flex-col justify-between">
          <Categories
            formTrigger={(trigger) => formTriggerRefs.current.push(trigger)}
            isVisitor={isVisitor}
          />
          {isVisitor ? (
            <Link to="/auth/signin">
              <Button
                variant="menu"
                text="Sign In / Sign Up"
                icon={<UserIcon className="h-8 w-6 text-lime-500" />}
              />
            </Link>
          ) : (
            <SignOut />
          )}
        </div>
      </div>
      {isSmallScreen && (
        <Bars3Icon
          className="h-8 w-8 cursor-pointer text-lime-500 transition-all duration-300"
          onClick={() => setIsSideBarOpen(true)}
        />
      )}
    </>
  );
}
