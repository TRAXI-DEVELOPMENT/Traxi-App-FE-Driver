import axiosInstance from "@/utils/axios";

export const uploadImage = async (imageUri: string) => {
  const formData = new FormData();
  const response = await fetch(imageUri);
  const blob = await response.blob();

  formData.append("ImageUrl", {
    uri: imageUri,
    type: "image/jpeg",
    name: "upload.jpg",
  } as any);

  console.log("FormData:", formData);

  try {
    const response = await axiosInstance.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    throw error;
  }
};

export const uploadImageVehicle = async (imageUri: string) => {
  const formData = new FormData();
  const response = await fetch(imageUri);
  const blob = await response.blob();

  formData.append("ImageUrl", {
    uri: imageUri,
    type: "image/jpeg",
    name: "upload.jpg",
  } as any);

  console.log("FormData:", formData);

  try {
    const response = await axiosInstance.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.link_img;
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    throw error;
  }
};
