import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  byDateChart,
  IncomingCallStats as IncomingCallStatsApi,
  appealStats as appealStatsApi,
} from '@/api/statistic'

export const useStatisticStore = defineStore('statistic', () => {
  const fetchByCallChart = async (params: any) => {
    const res = await byDateChart(params)
    return res
  }
  const FetchIncomingCallStats = async (params: any) => {
    const response = await IncomingCallStatsApi(params)
    return response      
  }
  const FetchAppealStats = async (params: any) => {
    const response = await appealStatsApi(params)
    return response      
  }
  return {
    fetchByCallChart,
    FetchIncomingCallStats,
    FetchAppealStats
  }
})
