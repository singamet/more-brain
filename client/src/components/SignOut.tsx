import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/16/solid";
import Button from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "../api/auth";
import { useSetAtom } from "jotai";
import { currentUser } from "../atoms/app";
import { useNavigate } from "react-router-dom";

export default function SignOut() {
  const token = localStorage.getItem("auth");
  const setUser = useSetAtom(currentUser);
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: () => signOut(token as string),
    onSuccess: () => {
      localStorage.removeItem("auth");
      setUser({
        isAuth: false,
      });
      console.log("Sign out");
      navigate("/auth/signin");
    },
  });
  return (
    <div className="border-t-[1px] border-t-lime-800">
      <Button
        variant="menu"
        text={mutation.isPending ? "Signing Out..." : "Sign Out"}
        icon={
          <ArrowRightStartOnRectangleIcon className="h-6 w-6 text-lime-500" />
        }
        onClick={async () => {
          await mutation.mutateAsync();
        }}
      />
    </div>
  );
}
