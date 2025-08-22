import { defineStore } from 'pinia'
import { ref,reactive } from 'vue'
import {
  outgoingCalls as outgoingCallsApi,
  IncomingCallStats as IncomingCallStatsApi
} from '@/api/calls' 

export const useCallStore = defineStore('call', () => {
  const outgoingCalls = ref({})
  const incomingCallStatistics = ref({})
  const loading = ref(false)
  const error = ref(null)
  
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
  const IncomingCallStats = async (params: any) => {
    loading.value = true
    try {
      const response = await IncomingCallStatsApi(params)

      if (response) {
        incomingCallStatistics.value = response || {}
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
    incomingCallStatistics,
    fetchOutgoingCalls,
    IncomingCallStats
  }
})
