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
}

export interface BookingData extends Booking {
  numNights: number;
  cabinPrice: number;
  extrasPrice: number;
  totalPrice: number;
  status: string;
  guests?: {
    fullName: string;
    email: string;
    country: string;
    countryFlag: string;
    nationalID: string;
  };
  cabins: {
    name: string;
  };
}

export interface CabinsData {
  id: number;
  created_at: string;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string;
}

export interface CabinsCreate {
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: string;
}
