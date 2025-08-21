import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  byDateChart,
  byStatusWithDetailChart,
  byOperatorChart
} from '@/api/statistic'

export const useStatisticStore = defineStore('statistic', () => {
  const error = ref(null)
  const fetchByCallChart = async (params: any) => {
    const res = await byDateChart(params)
    return res
  }
  const fetchByStatusWithDetailChart = async (params: any) => {
    const res = await byStatusWithDetailChart(params)
    return res
  }

  const fetchByOperatorChart = async (params: any) => {
    const res = await byOperatorChart(params)
    return res.data
  }
  return {
    error,
    fetchByCallChart,
    fetchByStatusWithDetailChart,
    fetchByOperatorChart,

  }
})
