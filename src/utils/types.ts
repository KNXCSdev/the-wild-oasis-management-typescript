export interface Booking {
  created_at: string;
  startDate: string;
  endDate: string;
  cabinId: number;
  guestId: number;
  hasBreakfast: boolean;
  observations: string;
  isPaid: boolean;
  numGuests: number;
  numNights?: number;
  cabinPrice?: number;
  extrasPrice?: number;
  totalPrice?: number;
  status?: string;
  guests?: {
    fullName: string;
    email: string;
    country: string;
    countryFlag: string;
    nationalID: string;
  };
  cabins?: {
    name: string;
  };
}
