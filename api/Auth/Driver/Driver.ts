import axiosInstance from "@/utils/axios";

export const getDriverProfile = async (driverId: string) => {
  try {
    const response = await axiosInstance.get(`/driver/${driverId}`);
    return response.data;
  } catch (error) {
    console.log("Lỗi khi lấy thông tin tài xế:", error);
    throw error;
  }
};


// Lưu Code ProfileDriverPage

// const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(
//   null
// );

// useEffect(() => {
//   const fetchDriverInfo = async () => {
//     const driverInfoString = await AsyncStorage.getItem("USER_INFO");
//     const driverInfo = driverInfoString ? JSON.parse(driverInfoString) : null;
//     const driverId = driverInfo?.id;

//     if (driverId) {
//       getDriverProfile(driverId)
//         .then((data) => {
//           setDriverProfile(data.result);
//         })
//         .catch((error) => {
//           console.error("Không thể lấy thông tin tài xế:", error);
//         });
//     }
//   };

//   fetchDriverInfo();
// }, []);

// console.log(driverProfile);