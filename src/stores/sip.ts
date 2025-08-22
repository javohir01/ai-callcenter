import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  index as indexApi,
  create as createApi,
  show as showApi,
  update as updateApi,
  destroy as destroyApi,
} from '@/api/sip'

export const useSipStore = defineStore('sip', () => {
  const error = ref(null)
  const sips = ref({})
  const sip = ref({})
  const loading = ref(false)

  const index = async (params: any) => {
    loading.value = true
    try {
      const response = await indexApi(params)
      console.log('SIP response data:', response.data);

      if (response?.data) {
        console.log(response.data);
        console.log('SIP response data:', response.data);
        sips.value = response.data || []
      }
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }
  const create = async (params: any) => {
    const response = await createApi(params)
    return response      
  }
  const show = async (params: any) => {
    const res = await showApi(params)
    return res
  }
  const update = async (params: any) => {
    const response = await updateApi(params)
    return response      
  }
  const destroy = async (params: any) => {
    const res = await destroyApi(params)
    return res
  }
  return {
    error,
    loading,
    sips,
    sip,
    index,
    create,
    show,
    update,
    destroy,
  }
})
