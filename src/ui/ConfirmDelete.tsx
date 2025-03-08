import styled from "styled-components";
import Button from "./Button";
import Heading from "./Heading";

const StyledConfirmDelete = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

interface ConfrimDeleteProps {
  resourceName: string;
  onConfirm: () => void;
  disabled: boolean;
  onCloseModal?: () => void;
}

function ConfirmDelete({ resourceName, onConfirm, disabled, onCloseModal }: ConfrimDeleteProps) {
  return (
    <StyledConfirmDelete>
      <Heading as="h3">Delete {resourceName}</Heading>
      <p>
        Are you sure you want to delete this {resourceName} permanently? This action cannot be
        undone.
      </p>

      <div>
        <Button size="medium" variation="secondary" disabled={disabled} onClick={onCloseModal}>
          Cancel
        </Button>
        <Button size="medium" variation="danger" disabled={disabled} onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}

export default ConfirmDelete;
