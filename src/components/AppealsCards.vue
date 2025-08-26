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
    icon: 'img/appeals/new-user.svg',
    title: 'Новые',
    value: data.value?.new?.count || 0,
    change: data.value?.new?.percentage || 0,
    percentage: data.value?.new?.is_increased,
    color: '#E3F2FD'
  },
  {
    icon: 'img/appeals/appeal.svg',
    title: 'В обработке',
    value: data.value?.in_progress?.count || 0,
    change: data.value?.in_progress?.percentage || 0,
    percentage: data.value?.in_progress?.is_increased,
    color: '#E3F2FD'
  },
  {
    icon: 'img/appeals/solved.svg',
    title: 'Решено',
    value: data.value?.resolved?.count || 0,
    change: data.value?.resolved?.percentage || 0,
    percentage: data.value?.resolved?.is_increased,
    color: '#E3F2FD'
  },
  {
    icon: 'img/appeals/not-solved.svg',
    title: 'Не решено',
    value: data.value?.closed?.count || 0,
    change: data.value?.closed?.percentage || 0,
    percentage: data.value?.closed?.is_increased,
    color: '#E3F2FD'
  }
]);

const FetchAppealStats = async () => {
  isLoading.value = true
  try {
    const res = await statisticStore.FetchAppealStats()
    if (res?.data) {
      data.value = res.data || {}
    }
    console.log(data.value)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  FetchAppealStats()
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