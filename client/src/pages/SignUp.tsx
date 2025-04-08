import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { AuthResponseType, SignUpType } from "../lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../ui/Input";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "../api/auth";
import { useSetAtom } from "jotai";
import { currentUser } from "../atoms/app";
import Button from "../ui/Button";
import { signUpSchema } from "../lib/schema";

export default function SignUp() {
  const setCurrentUser = useSetAtom(currentUser);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
  });
  const mutation = useMutation({
    mutationFn: (data: SignUpType) => signUp(data),
  });
  const onSubmit = handleSubmit(async (data) => {
    await mutation.mutateAsync(data, {
      onSuccess: (response: AuthResponseType) => {
        localStorage.setItem("auth", response.token);
        setCurrentUser({
          isAuth: true,
          fullname: response.fullname,
          email: response.email,
          token: response.token,
        });
        reset();
      },
    });
  });
  return (
    <>
      <h2 className="text-center text-2xl font-bold tracking-wide text-zinc-300">
        Sign Up
      </h2>
      <form onSubmit={onSubmit} className="mt-4 flex w-4/5 flex-col gap-4">
        <Input
          type="text"
          name="fullname"
          register={register}
          label="Name"
          error={errors.fullname?.message}
        />

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
            isSubmitting || mutation.isPending ? "Signing Up..." : "Sign Up"
          }
        />
      </form>
      <div className="flex gap-2">
        <p className="text-md tracking-wide text-zinc-200">
          Already have an account?
        </p>
        <Link
          to="/auth/signin"
          className="cursor-pointer tracking-wide text-lime-200 transition-all duration-200 hover:text-lime-300"
        >
          Sign In
        </Link>
      </div>
    </>
  );
}
