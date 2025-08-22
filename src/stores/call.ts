import { defineStore } from 'pinia'
import { ref,reactive } from 'vue'
import {
  outgoingCalls as outgoingCallsApi,
  IncomingCalls as IncomingCallsApi,
  collections as collectionsApi
} from '@/api/calls' 

export const useCallStore = defineStore('call', () => {
  const outgoingCalls = ref({})
  const incomingCalls = ref({})
  const collections = ref({})
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
  const FetchIncomingCalls = async (params: any) => {
    loading.value = true
    try {
      const response = await IncomingCallsApi(params)
      if (response?.data) {
        incomingCalls.value = response.data || []
      }
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  const FetchCollections = async (params: any) => {
    loading.value = true
    try {
      const response = await collectionsApi(params)
      if (response?.data) {
        collections.value = response.data || []
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
    incomingCalls,
    collections,
    fetchOutgoingCalls,
    FetchIncomingCalls,
    FetchCollections,
  }
})
