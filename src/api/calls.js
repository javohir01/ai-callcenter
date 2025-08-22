import axiosInstance from "@/utils/axios.js";

export async function outgoingCalls(params) {
  return axiosInstance({
    url: `/calls/outgoing`,
    method: 'GET',
    params
  })
}

export async function IncomingCalls(params) {
  return axiosInstance({
    url: `/calls/incoming`,
    method: 'GET',
    params
  })
}
export async function collections(params) {
  return axiosInstance({
    url: `/campaigns`,
    method: 'GET',
    params
  })
}