import { ApplyDriverResponse } from "@/types/Trip";
import axiosInstance from "@/utils/axios";

export const getTripDriver = async (driverId: string) => {
  try {
    const response = await axiosInstance.get(`/trip-driver/${driverId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trip driver data:", error);
    throw error;
  }
};

export const getTripDetail = async (tripId: string) => {
  try {
    const response = await axiosInstance.get(`/trip-no-driver/${tripId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trip detail data:", error);
    throw error;
  }
};

export const getDetailTrip = async (tripId: string) => {
  try {
    const response = await axiosInstance.get(`/trip-no-driver/${tripId}`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching trip detail data:", error);
    throw error;
  }
};

export const getAllTripsNoDriver = async () => {
  try {
    const response = await axiosInstance.get("/trip-all-no-driver");
    return response.data.result;
  } catch (error) {
    console.error("Error fetching all trips without driver data:", error);
    throw error;
  }
};

export const applyDriver = async (
  driverId: string,
  tripId: string
): Promise<ApplyDriverResponse> => {
  try {
    const response = await axiosInstance.post<ApplyDriverResponse>(
      "/apply-driver",
      {
        driverId,
        tripId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error applying driver:", error);
    throw error;
  }
};

export const completeTrip = async (tripId: string) => {
  try {
    const response = await axiosInstance.post("/trip-complete", { tripId });
    return response.data.result;
  } catch (error) {
    console.error("Lỗi khi hoàn thành chuyến đi:", error);
    throw error;
  }
};

export default axiosInstance;
