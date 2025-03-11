import { useQuery } from "@tanstack/react-query";

import { getBooking } from "../../services/apiBookings";

export function useBooking(bookingId: number) {
  const { isPending, data: booking } = useQuery({
    queryKey: ["booking"],
    queryFn: () => getBooking(bookingId),
  });

  return { booking, isPending };
}
