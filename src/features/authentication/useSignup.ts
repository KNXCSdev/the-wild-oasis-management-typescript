import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import toast from "react-hot-toast";

export function useSignup() {
  const { mutate: signup, isPending } = useMutation({
    mutationFn: ({
      email,
      password,
      fullName,
    }: {
      email: string;
      password: string;
      fullName: string;
    }) => signupApi({ email, password, fullName }),
    onSuccess: () => {
      toast.success(
        "Account successfully created! Please verify the new account from the user`s email address"
      );
    },
  });

  return { signup, isPending };
}
