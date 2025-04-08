import {
  DocumentDuplicateIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/react/16/solid";
import Modal from "../ui/Modal";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useMutation } from "@tanstack/react-query";
import { toggleShare } from "../api/auth";
import { useAtom } from "jotai";
import { currentUser } from "../atoms/app";

export default function ShareBrain() {
  const [isCopied, setIsCopied] = useState(false);
  const domain = window.location.origin;
  const [user, setUser] = useAtom(currentUser);
  const [isRestricted, setIsRestricted] = useState(!user?.shareLink);
  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  }, [isCopied]);
  const mutation = useMutation({
    mutationFn: (isRestrict: boolean) =>
      toggleShare(isRestrict, localStorage.getItem("auth") as string),
    onSuccess: (data: { shareLink: string | null }) => {
      if (data.shareLink) {
        setUser((prev) => {
          if (prev) return { ...prev, shareLink: data.shareLink };
        });
        setIsRestricted(false);
      } else {
        setUser((prev) => {
          if (prev) return { ...prev, shareLink: null };
        });
        setIsRestricted(true);
      }
    },
  });
  return (
    <Modal title="Share Brain">
      <div className="mt-4 flex w-xs flex-col gap-8 py-4">
        <p className="text-xs text-zinc-400">
          Note: When you share your brain link with someone, they can view the
          content you have added. Restrict your brain to disable that.
        </p>
        <div className="flex w-full items-center justify-center">
          <button
            className={clsx(
              "flex w-1/2 translate-x-4 cursor-pointer items-center justify-center rounded-2xl border-[1px] border-zinc-500 py-2",
              {
                "z-10 bg-lime-800 text-lime-100": !isRestricted,
              },
            )}
            onClick={async () => {
              await mutation.mutateAsync(false);
            }}
          >
            <LockOpenIcon className="h-4 w-4" />
          </button>
          <button
            className={clsx(
              "flex w-1/2 -translate-x-4 cursor-pointer items-center justify-center rounded-2xl border-[1px] border-zinc-500 py-2",
              {
                "z-10 bg-lime-800 text-lime-100": isRestricted,
              },
            )}
            onClick={async () => {
              await mutation.mutateAsync(true);
            }}
          >
            <LockClosedIcon className="h-4 w-4" />
          </button>
        </div>
        <button
          className={clsx(
            "flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-lime-800 py-2 text-sm text-zinc-100 transition-all duration-400",
            {
              "opacity-50": isRestricted,
              "hover:font-semibold": !isRestricted,
            },
          )}
          disabled={isRestricted}
          onClick={() => {
            navigator.clipboard.writeText(
              `${user && user.shareLink ? `${domain}/shared/${user.shareLink}` : ""}`,
            );
            setIsCopied(true);
          }}
        >
          <DocumentDuplicateIcon className="h-4 w-4" />
          <span>{isCopied ? "Copied" : "Copy Share Link"}</span>
        </button>
      </div>
    </Modal>
  );
}
