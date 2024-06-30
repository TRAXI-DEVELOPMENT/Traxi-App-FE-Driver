import axiosInstance from "../Trip/Trip";

export const getCustomerInfo = async (customerId: string) => {
  try {
    const response = await axiosInstance.get(`/customer-info/${customerId}`);
    return response.data.result;
  } catch (error) {
    console.log("Lỗi khi lấy thông tin tài xế:", error);
    throw error;
  }
};
