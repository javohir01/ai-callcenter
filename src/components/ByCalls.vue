<template>
  <div v-loading="isLoading">
    <div class="">
      <h1 class="statistic-section-title mr-3">Статистика</h1>
      <el-date-picker
        v-model="dateRange"
        class="filter-date"
        type="daterange"
        range-separator=" - "
        start-placeholder="Начало"
        end-placeholder="Конец"
        size="large"
        format="YYYY-MM-DD"
      />
    </div>
    <div style="display: flex; gap: 20px;">
      <VChart :option="statusOption" style="height: 300px; width: 50%;" />
      <VChart :option="dayOption" style="height: 300px; width: 50%;" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed, watch } from 'vue';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { graphic } from 'echarts';
import { useStatisticStore } from "@/stores/statistic.js";
import { formatDateToIso } from "@/utils/helpers.js";
import { ElDatePicker } from "element-plus";

use([CanvasRenderer, PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

const statisticStore = useStatisticStore();
const isLoading = ref(false);
const filter = ref({
  startDate: null,
  endDate: null
});
const dateRange = ref('');
let statusData = reactive(null);
let dayData = reactive(null);
const totalStatusCount = ref(null);
const totalDayCount = ref(null);

const statusOption = computed(() => {
  let chartData = [];
  if (statusData && statusData.length > 0) {
    chartData = statusData.map(item => ({
      value: item.percentage,
      name: item.label_ru,
      itemStyle: {
        color: item.status === 'COMPLETED' ? '#4CAF50' : '#F44336'
      }
    }));
  }
  return {
    title: [
      {
        text: `Общее количество статусов: ${totalStatusCount.value}`,
        left: 'center',
        top: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          textAlign: 'center'
        }
      }
    ],
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c}% ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      data: statusData ? statusData.map(item => item.label_ru) : []
    },
    series: [
      {
        type: 'pie',
        radius: ['60%', '80%'],
        avoidLabelOverlap: false,
        label: { show: false },
        data: chartData
      }
    ]
  };
});

const dayOption = computed(() => {
  let days = [];
  let callCounts = [];
  if (dayData && dayData.length > 0) {
    dayData.forEach(item => {
      days.push(item.day);
      callCounts.push(item.call_count);
    });
  }
  return {
    title: [
      {
        text: `Общее количество звонков: ${totalDayCount.value}`,
        left: 'center',
        top: '5px',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
          textAlign: 'center'
        }
      }
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: days
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'bar',
        data: callCounts,
        itemStyle: {
          color: '#2196F3'
        }
      }
    ]
  };
});

watch(dateRange, (newVal) => {
  filter.value.startDate = newVal?.[0] ? formatDateToIso(newVal[0]) : null;
  filter.value.endDate = newVal?.[1] ? formatDateToIso(newVal[1]) : null;
  fetchCharts();
});

const fetchCharts = async () => {
  isLoading.value = true;
  try {
    const [callRes, dayRes] = await Promise.all([
      statisticStore.fetchByCallChart({ ...filter.value }),
    ]);
    if (callRes?.data?.status_distribution) {
      statusData = callRes.data.status_distribution || [];
      totalStatusCount.value = statusData.reduce((sum, item) => sum + item.count, 0) || 0;
    }
    if (callRes?.data?.weekly_duration) {
      dayData = callRes?.data?.weekly_duration || [];
      totalDayCount.value = dayData.reduce((sum, item) => sum + item.call_count, 0) || 0;
    }
  } catch (error) {
    console.error('Error fetching chart data:', error);
  } finally {
    isLoading.value = false;
  };
};

onMounted(() => {
  fetchCharts();
});
</script>

<style>
.header {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}
</style>