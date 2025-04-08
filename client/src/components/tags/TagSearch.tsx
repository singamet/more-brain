import {
  Control,
  FieldValues,
  Path,
  useFieldArray,
  UseFormRegister,
} from "react-hook-form";
import { AddContentType } from "../../lib/types";
import { ChangeEvent, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addTag, getTags } from "../../api/tag";
import clsx from "clsx";
import Button from "../../ui/Button";

export default function TagSearch<T extends FieldValues>({
  name,
  label,
  control,
  error,
}: {
  name: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  control: Control<AddContentType>;
  error?: string;
}) {
  const [tagInput, setTagInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [tagSearchResults, setTagSearchResults] = useState<
    AddContentType["tags"]
  >([]);
  const { fields, append, remove } = useFieldArray<AddContentType>({
    control,
    name: "tags",
  });

  const token = localStorage.getItem("auth");
  const searchQuery = useQuery({
    queryKey: ["searchTag", tagInput, token],
    queryFn: () => getTags(tagInput, token as string),
    enabled: !!token && tagInput.length > 2,
  });
  useEffect(() => {
    if (searchQuery.isSuccess) {
      const resultSet: AddContentType["tags"] = searchQuery.data;

      setTagSearchResults(
        resultSet.filter((r) => !fields.flatMap((f) => f._id).includes(r._id)),
      );
    }
  }, [searchQuery.isSuccess, searchQuery.data, fields]);
  const addMutation = useMutation({
    mutationFn: () => addTag(tagInput, token as string),
    onSuccess: (data: AddContentType["tags"][number]) => {
      append({ _id: data._id, tagname: data.tagname });
      setTagInput("");
    },
    onError: (error) => {
      setInputError(error.message);
    },
  });
  useEffect(() => {
    if (tagInput.length > 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [tagInput]);
  const searchTag = async (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={name} className="tracking-widest text-zinc-200">
        {label}
      </label>
      <div className="relative w-full">
        <input
          type="text"
          value={tagInput}
          onChange={(e) => searchTag(e)}
          id={name}
          className="w-full border-b-2 border-b-zinc-400 px-2 py-1 text-lg outline-none"
        />

        {(error || inputError) && (
          <div className="absolute bottom-12 left-1/4 translate-x-1/3 transform bg-zinc-200 px-2 py-1 text-center text-sm text-red-900 transition-all duration-300">
            {error ? error : inputError ? inputError : ""}
            <div className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 bg-zinc-200"></div>
          </div>
        )}
        {showResults && (
          <ul className="absolute z-20 flex max-h-48 w-full flex-col overflow-y-auto">
            {tagSearchResults.every(
              (r) => r.tagname.toLowerCase() !== tagInput.toLowerCase(),
            ) && (
              <li className="flex w-full rounded-t-xl border-2 border-zinc-800 bg-zinc-800 px-4 py-1 text-zinc-200 hover:bg-lime-800">
                <button
                  type="button"
                  className="w-full cursor-pointer text-left text-sm"
                  onClick={async () => {
                    if (tagInput.length === 0) {
                      setInputError("Required");
                    } else {
                      setInputError("");
                      await addMutation.mutateAsync();
                    }
                  }}
                >
                  Add "{tagInput}"
                </button>
              </li>
            )}
            {tagSearchResults &&
              tagSearchResults.length > 0 &&
              tagSearchResults.map((result, index) => (
                <li
                  key={result._id}
                  className={clsx(
                    "flex w-full border-2 border-zinc-800 bg-zinc-800 px-4 py-1 text-zinc-200 hover:bg-lime-800",
                    {
                      "rounded-b-xl": index === tagSearchResults.length - 1,
                    },
                  )}
                >
                  <button
                    type="button"
                    className="w-full cursor-pointer text-left text-sm"
                    onClick={() => {
                      append({ _id: result._id, tagname: result.tagname });
                      setTagInput("");
                    }}
                  >
                    {result.tagname}
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>
      <div className="">
        {fields.map((field, index) => (
          <Button
            variant="tag"
            text={field.tagname}
            className="transition-all duration-3000 hover:line-through"
            onClick={() => {
              remove(index);
            }}
            key={field.id}
          />
        ))}
      </div>
    </div>
  );
}
