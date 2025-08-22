import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  byDateChart,
  IncomingCallStats as IncomingCallStatsApi,
} from '@/api/statistic'

export const useStatisticStore = defineStore('statistic', () => {
  const error = ref(null)
  const incomingCallStatistics = ref({})
  const loading = ref(false)

  const fetchByCallChart = async (params: any) => {
    const res = await byDateChart(params)
    return res
  }
  const FetchIncomingCallStats = async (params: any) => {
    const response = await IncomingCallStatsApi(params)
    return response      
  }
  return {
    error,
    incomingCallStatistics,
    fetchByCallChart,
    FetchIncomingCallStats
  }
})
