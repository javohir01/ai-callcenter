import axiosInstance from "@/utils/axios.js";

export async function index(params) {
  return axiosInstance({
    url: `/sip`,
    method: 'GET',
    params
  })
}

export async function create(data) {
  return axiosInstance({
    url: `/sip`,
    method: 'POST',
    data: data
  })
}
export async function show(params) {
  return axiosInstance({
    url: `/sip/${params.sip_uuid}`,
    method: 'GET',
    params
  })
}
export async function update(params) {
  return axiosInstance({
    url: `/sip/${params.sip_uuid}`,
    method: 'PUT',
    params
  })
}
export async function destroy(params) {
  return axiosInstance({
    url: `/sip/${params.sip_uuid}`,
    method: 'DELETE',
    params
  })
}