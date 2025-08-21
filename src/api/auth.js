import axios from '@/utils/axios.js'
import axiosInstance from "@/utils/axios.js";

export async function login(phone, password) {
  return axios({
    url: `/auth/login`,
    method: 'POST',
    data: {
      phone,
      password
    }
  })
}
export async function getMe() {
  return axiosInstance({
    url: `/auth/profile`,
    method: 'GET',
  })
}