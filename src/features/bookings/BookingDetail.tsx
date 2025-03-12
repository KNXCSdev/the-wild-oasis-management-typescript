import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useNavigate } from "react-router";
import { useBooking } from "./useBooking";
import Spinner from "../../ui/Spinner";
import PageNotFound from "../../pages/PageNotFound";
import { HiArrowUpOnSquare } from "react-icons/hi2";
import { useCheckout } from "../check-in-out/useCheckout";
import { useDeleteBooking } from "./useDeleteBooking";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const moveBack = useMoveBack();
  const navigate = useNavigate();
  const { checkout, isCheckinOut } = useCheckout();
  const { deleteBook, isDeleting } = useDeleteBooking();

  const { booking, isPending, bookingId } = useBooking();

  if (isPending) return <Spinner />;

  if (!booking) return <PageNotFound />;

  const { status } = booking;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status as keyof typeof statusToTagName]}>
            {status.replace("-", " ")}
          </Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {status === "unconfirmed" && (
          <Button
            variation="primary"
            size="medium"
            onClick={() => navigate(`/checkin/${bookingId}`)}
          >
            Check in
          </Button>
        )}
        {status === "checked-in" && (
          <Button
            size="medium"
            variation="primary"
            disabled={isCheckinOut}
            onClick={() => checkout(Number(bookingId!))}
          >
            Check out
          </Button>
        )}

        <Modal>
          <Modal.Open opens="delete">
            <Button size="medium" variation="danger">
              Delete Booking
            </Button>
          </Modal.Open>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="booking"
              disabled={isDeleting}
              onConfirm={() => deleteBook(Number(bookingId!), { onSettled: () => navigate(-1) })}
            />
          </Modal.Window>
        </Modal>

        <Button size="medium" variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
