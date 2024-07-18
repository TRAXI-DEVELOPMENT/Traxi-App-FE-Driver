export interface TripItem {
  trip: Trip;
}

export interface Trip {
  Id: string;
  BookingDate: string;
  Status: string;
  UpDate: string;
  CustomerId: string;
  DriverId: string;
  Type: string | null;
  tripDetails: TripDetail;
}

export interface TripDetails {
  TripId: string;
  BookingDate: string;
  Status: string;
  UpDate: string;
  CustomerId: string;
  DriverId: string;
  TripDetail: TripDetail;
}

export interface TripDetail {
  Id: string;
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
}

export interface ApplyDriverResponse {
  result: {
    Distance: number;
    TotalPrice: number;
    InsDate: string | null;
    EndTime: string;
    StartTime: string;
    StartLocation: string;
    EndLocation: string;
    TripId: string;
    CustomerId: string;
    VehicleId: string;
    DriverId: string;
    FullName: string;
    Phone: string;
    ImageUrl: string;
  };
}
