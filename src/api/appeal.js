import axiosInstance from "@/utils/axios.js";

export async function applications(params) {
  return axiosInstance({
    url: `/applications`,
    method: 'GET',
    params
  })
}