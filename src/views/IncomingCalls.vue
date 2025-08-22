<template>
  <v-container fluid v-loading="isLoading" class="call-container">
    <div>
      <IncomingCallCards />  
    </div>
    <v-row class="mt-5">
      <div class="filter-bar">
        <el-input
          v-model.lazy="filter.phoneNumber"
          class="filter-search"
          size="large"
          placeholder="Поиск"
          clearable
          @keyup.enter="fetchOutgoingCall"
        >
          <template #prepend>
            <img src="/img/search.svg" style="width: 18px; height: 18px; margin-right: 6px;" />
          </template>
        </el-input>
      </div>
    </v-row>

    <!-- Data Table -->
    <!-- <div class="table-container">
      <v-data-table
        :headers="headers"
        :items="callStore?.outgoingCalls?.calls"
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
        <template #item.recording_url="{ item }">
          <div class="d-flex align-center">
            <audio controls style="width: 400px;">
              <source :src="item.recording_url" type="audio/wav">
              Ваш браузер не поддерживает воспроизведение аудио.
            </audio>
            <v-btn
              variant="plain"
              color="primary"
              size="large"
              :href="item.recording_url"
              download
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </div>
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
    </div> -->
  </v-container>
</template>

<script setup lang="ts">
import { ref, h, watch, onMounted } from 'vue'
import {useCallStore} from "@/stores/call";
import IncomingCallCards from '@/components/IncomingCallCards.vue';

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
  { title: 'Имя клиента', key: 'client_name', width: '200px' },
  { title: 'Запись звонка', key: 'recording_url', width: '400px' },
  { title: 'Телефон', key: 'phone', width: '200px' },
  { title: 'Дата', key: 'start_date', width: '300px' },
  { title: 'Статус', key: 'status_ru', width: '200px' },
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
  fetchOutgoingCall()
})
const fetchOutgoingCall = async () => {
  isLoading.value = true
  try {
    await callStore.fetchOutgoingCalls({...filter.value })
  } finally {
    isLoading.value = false
  }
}

const onPageChange = (newPage: number) => {
  fetchOutgoingCall()
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
const getStatus = (status: string) => {
  switch (status) {
    case 'CREATED': return 'Новый';
    case 'FAILED': return 'Неуспешно'
    case 'NOT_FOUND': return 'Неуспешно'
    case 'EXPIRED': return 'Неуспешно'
    case 'TRANSMITTED': return 'Успешно'
    case 'DELIVERED': return 'Успешно'
    case 'REJECTED': return 'Успешно'
    case 'NOT_DELIVERED': return 'Успешно'
    default: return status
  }
};

onMounted(() => {
  fetchOutgoingCall()
})
</script>

<style>
.filter-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 10px 20px;
  gap: 16px;
  margin-bottom: 16px;
}
.filter-date :deep(.el-input__wrapper),
.filter-search :deep(.el-input__wrapper) {
  background: #fff;
  border: none!important;
  box-shadow: none!important;
  border-radius: 14px;
  padding-left: 0;
  padding-right: 12px;
}
.filter-date :deep(.el-input__prefix),
.filter-search :deep(.el-input__prefix) {
  background: transparent;
  border: none!important;
}
.filter-bar .el-date-editor .el-input__wrapper,
.filter-bar .el-input__wrapper {
  background: transparent;
  border: none!important;
  box-shadow: none!important;
  border-radius: 14px;
  padding-left: 0;
  padding-right: 12px;
}
.filter-date :deep(.el-input__inner),
.filter-search :deep(.el-input__inner) {
  background: transparent;
  border: none!important;
  box-shadow: none;
}
.filter-bar .el-input-group__prepend{
  box-shadow: none!important;
  padding: 0;
}
.filter-bar .el-date-editor.el-input__wrapper{
  box-shadow: none !important;
  padding: 0;
  width: 140% !important;
}
.pagination-text{
  white-space: nowrap!important;
}
el-select.pagination-select {
  width: 70px!important;
}
.call-container .el-select--large{
  width: 90%;
}
.call-container .el-select--large .el-select__wrapper {
  width: 100px!important;
}
/* audio {
  width: 150px;
  height: 30px;
  border-radius: 4px;
  background-color: #f5f5f5;
}
audio::-webkit-media-controls-panel {
  background-color: #f5f5f5;
  border-radius: 4px;
}
audio::-webkit-media-controls-play-button {
  background-color: #4CAF50;
  border-radius: 50%;
}
audio::-webkit-media-controls-current-time-display,
audio::-webkit-media-controls-time-remaining-display {
  color: #333;
} */
</style>