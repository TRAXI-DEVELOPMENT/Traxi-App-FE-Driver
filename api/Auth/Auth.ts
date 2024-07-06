import axios from "axios";
import axiosInstance from "@/utils/axios";

interface ApplyJobRequest {
  Fullname: string;
  Phone: string;
  ImageUrl: string;
  Address: string;
  Password: string;
  Birthday: string;
}

interface ApplyJobResponse {
  result?: {
    DriverId: string;
    Birthday: string;
    ImageUrl: string | null;
    Status: number;
    Phone: string;
    Address: string;
    Password: string;
    Wallet: {
      Balance: number;
    };
  };
  error?: string;
  errorCode?: string;
}

export const applyJob = async (
  data: ApplyJobRequest
): Promise<ApplyJobResponse> => {
  try {
    const response = await axiosInstance.post<ApplyJobResponse>(
      "/driver/apply-job",
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw new Error("An unexpected error occurred");
  }
};
