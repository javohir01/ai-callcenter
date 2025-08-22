import axiosInstance from "@/utils/axios.js";

export async function outgoingCalls(params) {
  return axiosInstance({
    url: `/calls/outgoing`,
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