import axiosInstance from "@/utils/axios.js";

export async function byDateChart(params) {
  return axiosInstance({
    url: `/dashboard/charts`,
    method: 'GET',
    params
  })
}
export async function IncomingCallStats(params) {
  return axiosInstance({
    url: `/dashboard/stats`,
    method: 'GET',
    params
  })
}