import { Position } from "@/types/Position";
import axiosInstance from "./Trip";

export const getPosition = async (id: string): Promise<Position> => {
  try {
    const response = await axiosInstance.get(`/position/${id}`);
    return response.data.result;
  } catch (error) {
    throw new Error((error as any).response?.data?.error || "Error fetching position");
  }
};

