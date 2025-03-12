import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { mutate: deleteBook, isPending: isDeleting } = useMutation({
    mutationFn: (bookingId: number) => deleteBooking(bookingId),
    mutationKey: ["bookings"],
    onSuccess: () => {
      toast.success("Booking successfully deleted");

      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: ({ message }: { message: string }) => toast.error(message),
  });

  return { deleteBook, isDeleting };
}
