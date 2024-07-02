export interface DriverProfile {
  Id: string;
  FullName: string;
  ImageUrl: string;
  Phone: string;
  Address: string;
  UpDate: string;
  DegreeId: string | null;
  WalletId: string;
  Password: string;
  Status: number;
  InsDate: string;
  Birthday: string;
}

export interface DriverDegree {
  DriverId: string;
  No: string;
  DegreeName: string;
  Type: string;
  ImageUrl: string;
  Expires: string;
  IssuedBy: string;
}
