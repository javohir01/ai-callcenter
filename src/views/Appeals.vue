<template>
  <v-container fluid v-loading="isLoading" class="call-container">
    <div>
      <AppealsCards />  
    </div>
    <!-- Data Table -->
    <div class="table-container">
      <v-data-table
        :headers="headers"
        :items="AppealStore?.appeals?.applications"
        :loading="AppealStore.loading"
        :items-per-page="filter.per_page"
        :page.sync="filter.page"
        :server-items-length="totalItems"
        hide-default-footer
        class="balance-table"
      >
        <template #item.index="{ index }">
          <span class="row-number">{{ index + 1 }}</span>
        </template>
        <template #item.audio_url="{ item }">
          <div class="d-flex align-center">
            <audio controls style="width: 400px;">
              <source :src="item.audio_url" type="audio/wav">
              Ваш браузер не поддерживает воспроизведение аудио.
            </audio>
          </div>
        </template>
        <template #item.status_ru="{ item }">
          <v-chip
            size="small"
            variant="flat"
            :style="{
              backgroundColor: getBackColor(item.status_ru),
              color: getTextStyle(item.status_ru),
              borderRadius: '6px'
            }"
          >
            {{ item.status_ru }}
          </v-chip>
        </template>
        <template #item.start_date="{ item }">
          <div class="d-flex flex-column gap-2  ">
            <span class="date-text">{{ item.start_date }}</span>
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
          <span class="pagination-text d-flex">из {{ AppealStore?.appeals?.total }}</span>
        </div>
        <v-pagination
          v-model="filter.page"
          :length="AppealStore?.appeals?.total / filter.per_page + 1"
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
import {useAppealStore} from "@/stores/appeal";
import AppealsCards from '@/components/AppealsCards.vue';

const AppealStore = useAppealStore()

const itemsPerPageOptions = ['5', '10', '20', '50']
const isLoading = ref(false)
const totalItems = ref(0)
const filter = ref({
  per_page: 10,
  page: 1
})

const headers = [
  { title: '#', key: 'index', width: '60px', sortable: false },
  { title: 'Номер телефона', key: 'phone', width: '200px' },
  { title: 'Дата и время звонка', key: 'call_datetime', width: '300px' },
  { title: 'Язык обращения', key: 'detected_language_ru', width: '200px' },
  { title: 'Запись звонка', key: 'audio_url', width: '400px' },
  { title: 'Транскрипция звонка', key: 'transcription', width: '200px' },
  { title: 'Статус обращения', key: 'status_ru', width: '200px' },
  { title: 'Комментрарий', key: 'operator_notes', width: '200px' },
]

watch([filter.value.page, filter.value.per_page], () => {
  fetchOutgoingCall()
})
const fetchOutgoingCall = async () => {
  isLoading.value = true
  try {
    await AppealStore.fetchAppeals({...filter.value })
  } finally {
    isLoading.value = false
  }
}

const onPageChange = (newPage: number) => {
  fetchOutgoingCall()
}
const getBackColor = (status: string) => {
    switch (status) {
      case "Новое" : return '#DDF7FB';
      case "В обработке": return '#FFF2DD';
      case "Решено": return '#DEFBE9'
      case "Не решено": return '#FEF2F2'
      default: return '#E2E3E5'
    }
  }
const getTextStyle = (status: string) => {
  switch (status) {
    case "Новое" : return '#056A7A';
    case "В обработке": return '#B17700';
    case "Решено": return '#284D2C'
    case "Не решено": return '#DC2626'
    default: return '#1B3822'
  }
};

onMounted(() => {
  fetchOutgoingCall()
})
</script>

<style>
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
  border-radius: 16px;
}
.call-container .el-select--large.status-select .el-select__wrapper {
  width: 300px!important;
}

thead tr th {
  font-weight: 600;
  font-size: 12px;
  color: #8A8A8A;
}
</style>