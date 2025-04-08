import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteContent } from "../../api/content";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import { useNavigate, useParams } from "react-router-dom";

export default function DeleteContent() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: () =>
      deleteContent(id as string, localStorage.getItem("auth") as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getContent"] });
      navigate(-1);
    },
  });

  return (
    <Modal title="Delete Content">
      <div className="mt-4 flex w-3xs flex-col gap-4 py-4">
        <p className="text-lg tracking-wide">Are you sure?</p>

        <div className="flex justify-end">
          <Button
            variant="warning"
            text="Delete"
            onClick={async () => {
              await mutation.mutateAsync();
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
