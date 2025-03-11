import styled from "styled-components";
import BookingDataBox from "../bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "../bookings/useBooking";
import Spinner from "../../ui/Spinner";
import { useEffect, useState } from "react";
import Checkbox from "../../ui/Checkbox";
import { formatCurrency } from "../../utils/helpers";
import PageNotFound from "../../pages/PageNotFound";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState<boolean>(false);
  const { booking, isPending } = useBooking();
  const moveBack = useMoveBack();

  useEffect(() => setConfirmPaid(booking?.isPaid || false), [booking?.isPaid]);

  if (isPending) return <Spinner />;

  if (!booking) return <PageNotFound />;

  const { id: bookingId, guests, totalPrice, numGuests, hasBreakfast, numNights } = booking;

  function handleCheckin() {}

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking!} />

      <Box>
        <Checkbox
          id="confirm"
          checked={confirmPaid}
          disabled={confirmPaid}
          onChange={() => setConfirmPaid((confirm) => !confirm)}
        >
          I confirm that {guests.fullName} has paid the total amount of {formatCurrency(totalPrice)}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button size="medium" variation="primary" onClick={handleCheckin} disabled={!confirmPaid}>
          Check in booking #{bookingId}
        </Button>
        <Button size="medium" variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
