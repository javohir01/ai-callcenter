import axiosInstance from "@/utils/axios.js";

export async function byDateChart(params) {
  return axiosInstance({
    url: `/dashboard/charts`,
    method: 'GET',
    params
  })
}
export async function byStatusWithDetailChart(params) {
  return axiosInstance({
    url: `/report/sms/summary-result-by-all-status`,
    method: 'GET',
    params
  })
}

export async function byOperatorChart(params) {
  return axiosInstance({
    url: `/report/sms/summary-result-by-operator`,
    method: 'GET',
    params
  })
}