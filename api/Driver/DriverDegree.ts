import { DriverDegree } from "@/types/Driver";
import axiosInstance from "../Trip/Trip";

export const getDriverDegree = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/driver-degree/${id}`);
    return response.data.result;
  } catch (error) {
    console.error("Error fetching driver degree:", error);
    throw error;
  }
};

export const postDriverDegree = async (data: DriverDegree) => {
  try {
    const response = await axiosInstance.post("/driverdegree", data);
    return response.data;
  } catch (error) {
    console.error("Error posting driver degree:", error);
    throw error;
  }
};
