<template>
  <v-container fluid v-loading="isLoading" class="call-container">
    <!-- Data Table -->
    <div class="table-container">
      <v-data-table
        :headers="headers"
        :items="callStore?.Settings?.calls"
        :loading="callStore.loading"
        :items-per-page="filter.per_page"
        :page.sync="filter.page"
        :server-items-length="totalItems"
        hide-default-footer
        class="balance-table"
      >
        <template #item.index="{ index }">
          <span class="row-number">{{ index + 1 }}</span>
        </template>

        <template #item.id="{ item }">
          <span class="transaction-id">{{ item.id }}</span>
        </template>

        <template #item.client_name="{ item }">
          <span class="comment-text">{{ item.client_name }}</span>
        </template>

        <template #item.phone="{ item }">
          <span class="amount-text">{{ item.phone }}</span>
        </template>
        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            :style="getChipStyle(item.status)"
            size="small"
            variant="flat"
            style="border-radius: 6px;"
          >
            {{ item.status_ru }}
          </v-chip>
        </template>
        <template #item.start_date="{ item }">
          <div class="d-flex flex-column gap-2  ">
            <span class="date-text">Дата начала:{{ item.start_date }}</span>
            <span class="date-text">Дата окончания:{{ item.end_date }}</span>
          </div>
        </template>
      </v-data-table>
  
      <div class="d-flex justify-space-between mt-4 ml-4 mb-2">
        <div class="d-flex align-center" style="gap:8px">
          <span class="pagination-text">Показано</span>
            <el-select
              v-model="filter.per_page"
              placeholder="Период"
              size="large"
              class="pagination-select"
              @update:modelValue="onPageChange"
            >
              <el-option
                v-for="item in itemsPerPageOptions"
                :key="item + 'page'"
                :label="item"
                :value="item"
              />
            </el-select>
          <span class="pagination-text d-flex">из {{ callStore?.Settings?.total }}</span>
        </div>
        <v-pagination
          v-model="filter.page"
          :length="callStore?.Settings?.total / filter.per_page + 1"
          :total-visible="5"
          color="primary"
          size="small"
          @update:modelValue="onPageChange"
        />
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, h, watch, onMounted } from 'vue'
import {useCallStore} from "@/stores/call";
import ByCalls from '@/components/ByCalls.vue';

const callStore = useCallStore()

const itemsPerPageOptions = ['5', '10', '20', '50']
const isLoading = ref(false)
const totalItems = ref(0)
const filter = ref({
  per_page: 10,
  page: 1,
  phoneNumber: "",
  status: null,
})
const headers = [
  { title: '#', key: 'index', width: '60px', sortable: false },
  { title: 'ID', key: 'id', width: '100px' },
  { title: 'Имя', key: 'client_name', width: '200px' },
  { title: 'Конечная точка', key: 'recording_url', width: '400px' },
  { title: 'Имя пользователя', key: 'phone', width: '200px' },
  { title: 'Количество каналов', key: 'start_date', width: '300px' },
  { title: 'Статус', key: 'status_ru', width: '200px' },
]

watch([filter.value.page, filter.value.per_page], () => {
  fetchSettings()
})
const fetchSettings = async () => {
  isLoading.value = true
  try {
    // await callStore.fetchSettings({...filter.value })
  } finally {
    isLoading.value = false
  }
}

const onPageChange = (newPage: number) => {
  fetchSettings()
}
const getStatusColor = (status: string) => {
    switch (status) {
      case 'CREATED': return '#FFF2DD'
      case 'FAILED': return '#FEF2F2'
      case 'NOT_FOUND': return '#FEF2F2'
      case 'EXPIRED': return '#FEF2F2'
      case 'TRANSMITTED': return '#E2FBE8'
      case 'DELIVERED': return '#E2FBE8'
      case 'REJECTED': return '#E2FBE8'
      case 'NOT_DELIVERED': return '#E2FBE8'
      default: return '#E2E3E5'
    }
  }
const getChipStyle = (status: string) => {
  switch (status) {
    case 'CREATED': return 'color: #B17700';
    case 'FAILED': return 'color: #DC2626'
    case 'NOT_FOUND': return 'color: #DC2626'
    case 'EXPIRED': return 'color: #DC2626'
    case 'TRANSMITTED': return 'color: #1B3822'
    case 'DELIVERED': return 'color: #1B3822'
    case 'REJECTED': return 'color: #1B3822'
    case 'NOT_DELIVERED': return 'color: #1B3822'
    default: return 'color: #1B3822'
  }
};
onMounted(() => {
  fetchSettings()
})
</script>

<style>
</style>