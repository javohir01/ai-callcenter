<template>
  <v-container fluid v-loading="isLoading" class="call-container">
    <!-- Data Table -->
    <div class="table-container">
      <v-data-table
        :headers="headers"
        :items="callStore?.collections?.campaigns"
        :loading="callStore.loading"
        :items-per-page="filter.per_page"
        :page.sync="filter.page"
        :server-items-length="totalItems"
        hide-default-footer
        class="balance-table"
      >
        <template #item.index="{ index }">
          <span class="row-number">{{ (filter.page-1)*filter.per_page + index + 1 }}</span>
        </template>

        <template #item.name="{ item }">
          <span class="transaction-id">{{ item.name }}</span>
        </template>

        <template #item.sip_name="{ item }">
          <span class="comment-text">{{ item.sip_name }}</span>
        </template>
        <template #item.channel_count="{ item }">
          <span class="comment-text">{{ item.channel_count }}</span>
        </template>
        <template #item.status_ru="{ item }">
          <v-chip
            :style="{
              backgroundColor: getStatusColor(item.status_ru),
              color: getChipStyle(item.status_ru),
              borderRadius: '6px'
            }"
            size="small"
            variant="flat"
            style="border-radius: 6px;"
          >
            {{ item.status_ru }}
          </v-chip>
        </template>
        <template #item.start_date="{ item }">
          <span class="date-text">{{ item.start_date }}</span>
        </template>
        <template #item.end_date="{ item }">
          <span class="date-text">{{ item.end_date }}</span>
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
          <span class="pagination-text d-flex">из {{ callStore?.outgoingCalls?.total }}</span>
        </div>
        <v-pagination
          v-model="filter.page"
          :length="callStore?.outgoingCalls?.total / filter.per_page + 1"
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
  { title: 'Имя', key: 'name', width: '400px' },
  { title: 'Имя Sip', key: 'sip_name', width: '300px' },
  { title: 'Количество каналов', key: 'channel_count', width: '100px' },
  { title: 'Статус', key: 'status_ru', width: '200px' },
  { title: 'Дата начала', key: 'start_date', width: '300px' },
  { title: 'Дата окончания', key: 'end_date', width: '300px' },
]
const statusOptions = [
  'CREATED',
  'FAILED',
  'NOT_FOUND',
  'EXPIRED',
  'TRANSMITTED',
  'DELIVERED',
  'REJECTED',
  'NOT_DELIVERED'
]

watch([filter.value.page, filter.value.per_page], () => {
  FetchCollections()
})
const FetchCollections = async () => {
  isLoading.value = true
  try {
    await callStore.FetchCollections({...filter.value })
  } finally {
    isLoading.value = false
  }
}

const onPageChange = (newPage: number) => {
  FetchCollections()
}
const getStatusColor = (status: string) => {
    switch (status) {
      case "Ожидает" : return '#FFF2DD';
      case "Занято": return '#E2FBE8';
      case "Выполняется": return '#FFF2DD'
      case "Приостановлен": return '#E2FBE8'
      case "Отменен": return '#FEF2F2'
      case "Завершен": return '#E2FBE8'
      case "Ошибка": return '#FEF2F2'
      default: return '#fff'
    }
  }
const getChipStyle = (status: string) => {
  switch (status) {
    case "Ожидает" : return '#B17700';
    case "Занято": return '#1B3822';
    case "Выполняется": return '#B17700'
    case "Приостановлен": return '#1B3822'
    case "Отменен": return '#DC2626'
    case "Завершен": return '#1B3822'
    case "Ошибка": return '#DC2626'
    default: return '#8A8A8A'
  }
};

onMounted(() => {
  FetchCollections()
})
</script>