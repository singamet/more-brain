import { useAtomValue } from "jotai";
import Modal from "../../ui/Modal";
import { AddContentType } from "../../lib/types";
import DropDown from "../../ui/DropDown";
import Button from "../../ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contentSchema } from "../../lib/schema";
import Input from "../../ui/Input";
import { categoriesAtom } from "../../atoms/app";
import TagSearch from "../tags/TagSearch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addContent } from "../../api/content";
import { useNavigate } from "react-router-dom";

export default function AddContent() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<AddContentType>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      tags: [],
    },
  });
  const mutation = useMutation({
    mutationFn: (data: AddContentType) =>
      addContent(data, localStorage.getItem("auth") as string),
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["getContent"] });
      navigate(-1);
    },
  });
  const categories = useAtomValue(categoriesAtom);
  const onSubmit = handleSubmit(async (data: AddContentType) => {
    await mutation.mutateAsync(data);
  });
  return (
    <>
      <Modal title="Add Content">
        <form
          onSubmit={onSubmit}
          className="mt-4 flex w-sm flex-col gap-4 py-4"
        >
          <Input
            name="title"
            type="text"
            label="Title"
            register={register}
            error={errors.title?.message}
          />

          <Input
            name="link"
            type="text"
            label="Link"
            register={register}
            error={errors.link?.message}
          />

          <DropDown
            name="category"
            options={categories}
            label="Category"
            register={register}
          />
          <TagSearch
            name="tags"
            label="Add Tags"
            register={register}
            control={control}
          />

          <Button variant="submit" text="Add" />
        </form>
      </Modal>
    </>
  );
}
