import { defineStore } from 'pinia'
import { ref,reactive } from 'vue'
import {
  applications as applicationsApi,
} from '@/api/appeal' 

export const useAppealStore = defineStore('appeal', () => {
  const appeals = ref({})
  const loading = ref(false)
  const error = ref(null)
  
  const fetchAppeals = async (params: any) => {
    loading.value = true
    try {
      const response = await applicationsApi(params)
      if (response?.data) {
        appeals.value = response.data || []
      }
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  return {
    loading,
    error,
    appeals,
    fetchAppeals
  }
})
