import { useState } from "react";
import { isFuture, isPast, isToday } from "date-fns";
import supabase from "../services/supabase";
import Button from "../ui/Button";
import { subtractDates } from "../utils/helpers";

import { bookings } from "./data-bookings";
import { cabins } from "./data-cabins";
import { guests } from "./data-guests";

// Helper function for error logging
const handleError = (error: any, operation: string) => {
  console.error(`Error during ${operation}:`, error.message);
};

// Delete functions
async function deleteGuests(): Promise<void> {
  const { error } = await supabase.from("guests").delete().gt("id", 0);
  if (error) handleError(error, "deleting guests");
}

async function deleteCabins(): Promise<void> {
  const { error } = await supabase.from("cabins").delete().gt("id", 0);
  if (error) handleError(error, "deleting cabins");
}

async function deleteBookings(): Promise<void> {
  const { error } = await supabase.from("bookings").delete().gt("id", 0);
  if (error) handleError(error, "deleting bookings");
}

// Create functions
async function createGuests(): Promise<void> {
  const { error } = await supabase.from("guests").insert(guests);
  if (error) handleError(error, "creating guests");
}

async function createCabins(): Promise<void> {
  const { error } = await supabase.from("cabins").insert(cabins);
  if (error) handleError(error, "creating cabins");
}

async function createBookings(): Promise<void> {
  try {
    const { data: guestsData, error: guestError } = await supabase
      .from("guests")
      .select("id")
      .order("id");

    const { data: cabinsData, error: cabinError } = await supabase
      .from("cabins")
      .select("id")
      .order("id");

    if (guestError || cabinError) {
      handleError(guestError || cabinError, "fetching guest or cabin IDs");
      return;
    }

    const allGuestIds = guestsData?.map((guest: any) => guest.id) || [];
    const allCabinIds = cabinsData?.map((cabin: any) => cabin.id) || [];

    const finalBookings = bookings.map((booking) => {
      const cabin = cabins[booking.cabinId - 1]; // Get cabin details
      const numNights = subtractDates(booking.endDate, booking.startDate);
      const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
      const extrasPrice = booking.hasBreakfast ? numNights * 15 * booking.numGuests : 0;
      const totalPrice = cabinPrice + extrasPrice;

      let status = "unconfirmed"; // Default status
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);

      if (isPast(endDate) && !isToday(endDate)) status = "checked-out";
      if ((isFuture(endDate) || isToday(endDate)) && isPast(startDate) && !isToday(startDate))
        status = "checked-in";

      return {
        ...booking,
        numNights,
        cabinPrice,
        extrasPrice,
        totalPrice,
        guestId: allGuestIds[booking.guestId - 1],
        cabinId: allCabinIds[booking.cabinId - 1],
        status,
      };
    });

    console.log("Final bookings data:", finalBookings);

    const { error } = await supabase.from("bookings").insert(finalBookings);
    if (error) handleError(error, "creating bookings");
  } catch (error) {
    handleError(error, "unexpected error in createBookings");
  }
}

function Uploader() {
  const [isLoading, setIsLoading] = useState(false);

  async function uploadAll(): Promise<void> {
    setIsLoading(true);
    try {
      await deleteBookings();
      await deleteGuests();
      await deleteCabins();
      await createGuests();
      await createCabins();
      await createBookings();
    } catch (error) {
      handleError(error, "uploading all data");
    } finally {
      setIsLoading(false);
    }
  }

  async function uploadBookings(): Promise<void> {
    setIsLoading(true);
    try {
      await deleteBookings();
      await createBookings();
    } catch (error) {
      handleError(error, "uploading bookings only");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        marginTop: "auto",
        backgroundColor: "#e0e7ff",
        padding: "8px",
        borderRadius: "5px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <h3>SAMPLE DATA</h3>

      <Button onClick={uploadAll} disabled={isLoading}>
        Upload ALL
      </Button>

      <Button onClick={uploadBookings} disabled={isLoading}>
        Upload bookings ONLY
      </Button>
    </div>
  );
}

export default Uploader;
