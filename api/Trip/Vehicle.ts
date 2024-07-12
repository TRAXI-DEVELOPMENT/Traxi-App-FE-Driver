import axiosInstance from "./Trip";

export const saveTripImage = async (data: {
  VehicleId: string;
  TripId: string;
  Type: string;
  ListImg: { Img: string }[];
  Note: string;
}): Promise<{
  result: {
    vehicle: string;
    trip: string;
  };
}> => {
  const response = await axiosInstance.post("/trip/save/img", data);
  return response.data;
};
