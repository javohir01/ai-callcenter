import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as apiLogin, getMe } from '@/api/auth.js'
import { setAccessToken } from "@/utils/localStorage"

const getLocal = <T>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}
const setLocal = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value))
}
const removeLocal = (key: string) => {
  localStorage.removeItem(key)
}

export const useAuthStore = defineStore('auth', () => {
  const defaultUser = { phone: '' }
  const isAuthenticated = ref(getLocal<boolean>('isAuthenticated', false))
  const user = ref(getLocal('user', defaultUser))

  const fetchUser = async () => {
    try {
      const response = await getMe()
      if (response?.data) {
        
      console.log('Login response:', response?.data)
      console.log('Login response1:', response)
        user.value = response.data
        setLocal('user', user.value)
      }
    } catch (error) {
      console.error('Profil maʼlumotlarini olishda xatolik:', error)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin(email, password)
      const data = response?.data
      if (data?.access_token) {
        isAuthenticated.value = true
        setAccessToken(data.access_token)
        await fetchUser()
        setLocal('isAuthenticated', true)
        setLocal('user', user.value)
        return true
      }
    } catch (e) {
      console.error('Login xatolik:', e)
    }
    isAuthenticated.value = false
    setLocal('isAuthenticated', false)
    removeLocal('user')
    return false
  }

  const logout = () => {
    isAuthenticated.value = false
    user.value = defaultUser
    setLocal('isAuthenticated', false)
    removeLocal('user')
    removeLocal('access_token')
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
    fetchUser
  }
})
