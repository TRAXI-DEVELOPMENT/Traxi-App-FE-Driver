export interface Trip {
  Id: string;
  BookingDate: string;
  Status: string;
  UpDate: string;
  CustomerId: string;
  DriverId: string;
  Type: string | null;
}

export interface TripDetail {
  TripId: string;
  BookingDate: string;
  Status: (string | null)[];
  UpDate: string;
  CustomerId: string;
  DriverId: string;
  TripDetail: {
    Distance: number;
    TotalPrice: number;
    InsDate: string | null;
    EndTime: string;
    StartTime: string;
    StartLocation: string;
    EndLocation: string;
    TripId: string;
    Vehicle: {
      Id: string;
      RegistrationDate: string;
      LicensePlate: string;
      Mode: string;
      Level: number;
      Type: string;
      Color: string;
      Capacity: string;
      Deflag: boolean;
      CustomerId: string;
      ImgURL: string;
    } | null;
  };
}
