import { useQuery } from "@tanstack/react-query";

import { getBooking } from "../../services/apiBookings";
import { useParams } from "react-router";

export function useBooking() {
  const { bookingId } = useParams();

  const { isPending, data: booking } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(Number(bookingId)),
    retry: false,
  });

  return { booking, isPending, bookingId };
}
