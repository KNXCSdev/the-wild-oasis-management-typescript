import { useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { updateBooking } from "../../services/apiBookings";
import { useNavigate } from "react-router";

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkin, isPending: isCheckinIn } = useMutation({
    mutationFn: ({ bookingId, breakfast }: { bookingId: number; breakfast: Object }) =>
      updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
        ...breakfast,
      }),
    onSuccess: () => {
      toast.success("Booking successfully checked-in");
      queryClient.invalidateQueries({ refetchType: "active" });
      navigate("/");
    },

    onError: ({ message }: { message: string }) => toast.error(message),
  });

  return { checkin, isCheckinIn };
}
