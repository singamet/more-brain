import { useAtomValue } from "jotai";
import { currentUser } from "../../atoms/app";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";
import { PlusIcon, ShareIcon } from "@heroicons/react/16/solid";

export default function MainContentHeader() {
  const user = useAtomValue(currentUser);
  const navigate = useNavigate();

  return (
    <div className="flex h-16 items-center justify-between gap-2 border-b-2 border-b-zinc-200 px-4 pb-4 opacity-100 dark:border-b-zinc-800">
      <h2 className="line-clamp-1 text-lg tracking-tight">
        Welcome, {user?.fullname}
      </h2>
      <div className="flex flex-1 items-center justify-end gap-4">
        <Button
          variant="secondary"
          text="Share Brain"
          icon={<ShareIcon className="h-6 w-6" />}
          onClick={() => {
            navigate("/content/share", {
              state: { modal: "shareBrain" },
            });
          }}
        />

        <Button
          variant="primary"
          text="Add Content"
          icon={<PlusIcon className="h-8 w-8" />}
          onClick={() => {
            navigate("/content/create", {
              state: { modal: "addContent" },
            });
          }}
        />
      </div>
    </div>
  );
}
