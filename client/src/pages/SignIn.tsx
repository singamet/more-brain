import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { AuthResponseType, SignInType } from "../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../ui/Input";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "../api/auth";
import { useSetAtom } from "jotai";
import { currentUser } from "../atoms/app";
import Button from "../ui/Button";
import { signInSchema } from "../lib/schema";

export default function SignIn() {
  const setCurrentUser = useSetAtom(currentUser);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignInType>({
    resolver: zodResolver(signInSchema),
  });
  const mutation = useMutation({
    mutationFn: (data: SignInType) => signIn(data),
    onSuccess: (data: AuthResponseType) => {
      localStorage.setItem("auth", data.token);
      setCurrentUser({
        isAuth: true,
        fullname: data.fullname,
        email: data.email,
        token: data.token,
      });
      reset();
    },
  });
  const onSubmit = handleSubmit(async (data) => {
    await mutation.mutateAsync(data);
  });
  return (
    <>
      <h2 className="text-center text-2xl font-bold tracking-wide text-zinc-300">
        Sign In
      </h2>
      <form onSubmit={onSubmit} className="mt-4 flex w-4/5 flex-col gap-4">
        <Input
          type="email"
          name="email"
          register={register}
          label="Email"
          error={errors.email?.message}
        />

        <Input
          type="password"
          name="password"
          register={register}
          label="Password"
          error={errors.password?.message}
        />
        {mutation.isError && (
          <p className="text-center text-sm text-red-300">
            {mutation.error.message}
          </p>
        )}
        <Button
          variant="submit"
          text={
            isSubmitting || mutation.isPending ? "Signing In..." : "Sign In"
          }
        />
      </form>
      <div className="flex gap-2">
        <p className="text-md tracking-wide text-zinc-200">
          Don't have an account?
        </p>
        <Link
          to="/auth/signup"
          className="cursor-pointer tracking-wide text-lime-200 transition-all duration-200 hover:text-lime-300"
        >
          Sign Up
        </Link>
      </div>
    </>
  );
}
