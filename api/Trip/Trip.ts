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

export default axiosInstance;
