import axiosInstance from "@/utils/axios.js";

export async function outgoingCalls(params) {
  return axiosInstance({
    url: `/calls/outgoing`,
    method: 'GET',
    params
  })
}

export async function smsFrame(params) {
  return axiosInstance({
    url: `/sms-templates`,
    method: 'GET',
    params
  })
}

export async function exportSmsFrame(params) { 
  return axiosInstance({
    url: `/sms-templates/export`,
    method: 'GET',
    params,
    responseType: 'blob'
  })
}