<template>
  <div v-loading="isLoading">
    <v-row class="cards">
      <v-col cols="3" v-for="(card, index) in cardsData" :key="index" class="card-col">
        <v-card class="card" :color="card.color" elevation="0">
          <v-card-text class="card-content">
            <div class="card-icon">{{ card.icon }}</div>
            <div class="card-title">{{ card.title }}</div>
            <div class="card-value">{{ card.value }}</div>
            <div :class="['card-change', card.change > 0 ? 'positive' : 'negative']">
              {{ card.change }} {{ card.percentage }}%
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCallStore } from '@/stores/call';

const callStore = useCallStore();
const isLoading = ref(false);
const data = ref(null);
const cardsData = ref([
  {
    icon: '📞', // Placeholder for phone icon
    title: 'Всего звонков сегодня',
    value: callStore.outgoingCalls?.stats?.totalCalls || 1247,
    change: 12.5,
    percentage: '+',
    color: '#E3F2FD' // Light blue background
  },
  {
    icon: '✅', // Placeholder for checkmark icon
    title: 'Отвеченные звонки',
    value: callStore.outgoingCalls?.stats?.answeredCalls || 1180,
    change: -12.5,
    percentage: '',
    color: '#E3F2FD' // Light blue background
  },
  {
    icon: '❌', // Placeholder for cross icon
    title: 'Пропущенные звонки',
    value: callStore.outgoingCalls?.stats?.missedCalls || 67,
    change: 12.5,
    percentage: '+',
    color: '#E3F2FD' // Light blue background
  },
  {
    icon: '⏱️', // Placeholder for clock icon
    title: 'Средняя длительность',
    value: callStore.outgoingCalls?.stats?.averageDuration || '3:24',
    change: 12.5,
    percentage: '+',
    color: '#E3F2FD' // Light blue background
  }
]);

const fetchIncomingCallStats = async () => {
  isLoading.value = true
  try {
    const res = await callStore.IncomingCallStats()
    console.log('res')
    console.log(res)
    console.log(callStore.incomingCallStatistics)
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
.cards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.card-col {
  padding: 0 8px;
}

.card {
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  height: 100%;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.card-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.card-value {
  font-size: 20px;
  font-weight: bold;
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