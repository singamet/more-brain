import { XMarkIcon } from "@heroicons/react/16/solid";
import { ReactNode, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

export default function Modal({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  function handleClose() {
    if (dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close();
    }
    navigate(-1);
  }
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <dialog
        ref={dialogRef}
        className="relative flex flex-col items-center rounded-lg bg-zinc-700 text-zinc-200 shadow-xs shadow-lime-400"
      >
        <div className="flex h-12 w-full items-center justify-between border-b-[1px] border-b-gray-500 p-4 text-lime-200">
          <h2 className="font-semibold tracking-widest">{title}</h2>
          <button onClick={handleClose} className="cursor-pointer">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="flex w-full flex-col items-center px-4 lg:px-8">
          {children}
        </div>
      </dialog>
    </div>,
    document.getElementById("modal-root") as HTMLDivElement,
  );
}
