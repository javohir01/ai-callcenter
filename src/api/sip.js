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
    url: `/sip/${params.uuid}`,
    method: 'GET',
    params
  })
}
export async function update(params) {
  return axiosInstance({
    url: `/sip/${params.uuid}`,
    method: 'PUT',
    data: params
  })
}
export async function destroy(uuid) {
  return axiosInstance({
    url: `/sip/${uuid}`,
    method: 'DELETE',
  })
}