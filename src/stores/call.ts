import { defineStore } from 'pinia'
import { ref,reactive } from 'vue'
import {
  outgoingCalls as outgoingCallsApi
} from '@/api/calls' 

export const useCallStore = defineStore('call', () => {
  const outgoingCalls = ref({})
  const loading = ref(false)
  const error = ref(null)
  const statuses = reactive({
    'CREATED': 'Создано',
    'FAILED': 'Ошибка',
    'NOT_FOUND': 'Не удалось',
    'EXPIRED': 'Истекло',
    'TRANSMITTED': 'Отправлено',
    'DELIVERED': 'Доставлено',
    'REJECTED': 'Отклонено',
    'NOT_DELIVERED': 'Не доставлено'
  })
  
  const fetchOutgoingCalls = async (params: any) => {
    loading.value = true
    try {
      const response = await outgoingCallsApi(params)
      if (response?.data) {
        outgoingCalls.value = response.data || []
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
    outgoingCalls,
    fetchOutgoingCalls
  }
})
