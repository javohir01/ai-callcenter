<template>
  <div v-loading="isLoading">
    <div class="d-flex justify-space-between mb-4 cards gap-2">
      <v-card v-for="(card, index) in cardsData" :key="index"  class="card" :color="card.color" elevation="0">
        <v-card-text class="card-content">
          <img :src="card.icon" alt="">
          <div class="card-title">{{ card.title }}</div>
          <div class="card-value">{{ card.value }}</div>
          <div :class="['card-change', card.percentage ? 'positive' : 'negative']">
            {{ card.change }}%
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStatisticStore } from '@/stores/statistic';

const statisticStore = useStatisticStore();
const isLoading = ref(false);
const data = ref(null);
const cardsData = computed(() => [
  {
    icon: 'img/incoming/total.svg',
    title: 'Всего звонков сегодня',
    value: data.value?.total_calls_today?.count || 0,
    change: data.value?.total_calls_today?.percentage || 0,
    percentage: data.value?.total_calls_today?.is_increased,
    color: '#E3F2FD'
  },
  {
    icon: 'img/incoming/answered.svg',
    title: 'Отвеченные звонки',
    value: data.value?.answered_calls?.count || 0,
    change: data.value?.answered_calls?.percentage || 0,
    percentage: data.value?.answered_calls?.is_increased,
    color: '#E3F2FD'
  },
  {
    icon: 'img/incoming/missed.svg',
    title: 'Пропущенные звонки',
    value: data.value?.missed_calls?.count || 0,
    change: data.value?.answered_calls?.percentage || 0,
    percentage: data.value?.answered_calls?.is_increased,
    color: '#E3F2FD'
  },
  {
    icon: 'img/incoming/average.svg',
    title: 'Средняя длительность',
    value: data.value?.average_duration?.count || 0,
    change: data.value?.average_duration?.percentage || 0,
    percentage: data.value?.average_duration?.is_increased,
    color: '#E3F2FD'
  },
  {
    icon: 'img/incoming/transfered.svg',
    title: 'Переведоды на оператора',
    value: data.value?.transferred_calls?.count || 0,
    change: data.value?.transferred_calls?.percentage || 0,
    percentage: data.value?.transferred_calls?.is_increased,
    color: '#E3F2FD'
  }
]);

const fetchIncomingCallStats = async () => {
  isLoading.value = true
  try {
    const res = await statisticStore.FetchIncomingCallStats()
    console.log('res')
    console.log(res?.data)
    console.log(statisticStore.incomingCallStatistics)
    if (res?.data) {
      data.value = res.data || {}
    }
    console.log(data.value.answered_calls)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchIncomingCallStats()
})
</script>

<style>
.card {
  border-radius: 12px;
  padding: 16px;
  text-align: left;
  height: 100%;
  min-width: 250px;
  background-color: unset!important;
}

.card-content {
  display: flex;
  flex-direction: column;
  /* align-items: center; */
}
.card-content img {
  width: 30px;
  height: 30px;
  margin-bottom: 8px;
}
.card-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.card-title {
  font-size: 12px;
  color: #374151;
  font-weight: 700;
  margin-bottom: 4px;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}

.card-change {
  font-size: 12px;
}

.positive {
  color: #2E7D32; /* Green for positive change */
}

.negative {
  color: #D32F2F; /* Red for negative change */
}
</style>