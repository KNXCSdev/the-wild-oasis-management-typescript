import { useState } from "react";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

import { useUser } from "./useUser";
import { useUpdateUser } from "./useUpdateUser";

function UpdateUserDataForm() {
  const { user } = useUser();
  const {
    email,
    user_metadata: { fullName: currentFullName },
  } = user!;

  const { isUpdating, updateUser } = useUpdateUser();

  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState<File | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!fullName) return;

    updateUser(
      { fullName, avatar },
      {
        onSuccess: () => {
          setAvatar(null);
          (e.target as HTMLFormElement).reset();
        },
      }
    );
  }

  function handleCancel() {
    setFullName(currentFullName);
    setAvatar(null);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          disabled={isUpdating}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          type="file"
          id="avatar"
          disabled={isUpdating}
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setAvatar(file);
          }}
        />
      </FormRow>
      <FormRow label="">
        <Button
          size="medium"
          type="reset"
          variation="secondary"
          disabled={isUpdating}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button size="medium" variation="primary" disabled={isUpdating}>
          Update account
        </Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
