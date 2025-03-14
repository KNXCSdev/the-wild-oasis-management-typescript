import { SubmitHandler, useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useSignup } from "./useSignup";
import SpinnerMini from "../../ui/SpinnerMini";

// Email regex: /\S+@\S+\.\S+/
interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

function SignupForm() {
  const { register, formState, getValues, handleSubmit, reset } = useForm<SignupFormData>();
  const { errors } = formState;
  const { signup, isPending } = useSignup();

  const onSubmit: SubmitHandler<SignupFormData> = (data) => {
    signup(data, { onSettled: () => reset() });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" error={errors?.fullName?.message as string | undefined}>
        <Input
          type="text"
          id="fullName"
          {...register("fullName", { required: "This field is required" })}
          disabled={isPending}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message as string | undefined}>
        <Input
          type="email"
          id="email"
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
          disabled={isPending}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message as string | undefined}
      >
        <Input
          type="password"
          id="password"
          disabled={isPending}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Repeat password"
        error={errors?.passwordConfirm?.message as string | undefined}
      >
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isPending}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value) => value === getValues().password || "Passwords need to match",
          })}
        />
      </FormRow>

      <FormRow label="">
        {/* type is an HTML attribute! */}
        <Button size="medium" variation="secondary" type="reset" disabled={isPending}>
          Cancel
        </Button>
        <Button size="medium" variation="primary">
          {!isPending ? "Create new user" : <SpinnerMini />}
        </Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
