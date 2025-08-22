<template>
  <div v-loading="isLoading">
    <div class="d-flex justify-space-between mb-4 cards gap-2">
      <v-card v-for="(card, index) in cardsData" :key="index"  class="card" :color="card.color" elevation="0">
        <v-card-text class="card-content">
          <img :src="card.icon" alt="">
          <div class="card-title">{{ card.title }}</div>
          <div class="card-value">{{ card.value }}</div>
          <div :class="['card-change', card.change > 0 ? 'positive' : 'negative']">
            {{ card.change }} {{ card.percentage }}%
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
const cardsData = ref([
  {
    icon: 'img/incoming/total.svg', // Placeholder for phone icon
    title: 'Всего звонков сегодня',
    value: data.value?.total_calls_today || 0,
    change: 12.5,
    percentage: '+',
    color: '#E3F2FD' // Light blue background
  },
  {
    icon: 'img/incoming/answered.svg', // Placeholder for checkmark icon
    title: 'Отвеченные звонки',
    value: data.value?.answered_calls || 0,
    change: -12.5,
    percentage: '',
    color: '#E3F2FD' // Light blue background
  },
  {
    icon: 'img/incoming/missed.svg', // Placeholder for cross icon
    title: 'Пропущенные звонки',
    value: data.value?.missed_calls || 67,
    change: 12.5,
    percentage: '+',
    color: '#E3F2FD' // Light blue background
  },
  {
    icon: 'img/incoming/average.svg', // Placeholder for clock icon
    title: 'Средняя длительность',
    value: data.value?.average_duration || 0,
    change: 12.5,
    percentage: '+',
    color: '#E3F2FD' // Light blue background
  },
  {
    icon: 'img/incoming/transfered.svg', // Placeholder for clock icon
    title: 'Переведоды на оператора',
    value: data.value?.transferred_calls || 0,
    change: 12.5,
    percentage: '+',
    color: '#E3F2FD' // Light blue background
  }
]);

const fetchIncomingCallStats = async () => {
  isLoading.value = true
  try {
    const res = await statisticStore.FetchIncomingCallStats()
    console.log('res')
    console.log(res)
    console.log(statisticStore.incomingCallStatistics)
    if (res?.data) {
      data.value = res.data || {}
    }
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