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
import { PieChart, LineChart, BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { graphic } from 'echarts';
import { useStatisticStore } from "@/stores/statistic.js";
import { formatDateToIso } from "@/utils/helpers.js";
import { ElDatePicker } from "element-plus";

use([CanvasRenderer, PieChart, LineChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

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

function getColor(status) {
  switch(status) {
    case "Завершен":
      return '#4CAF50';
    case "Не отвечен":
      return '#F44336';
    case "Звонит":
      return '#3B82F6';
    }
}
const statusOption = computed(() => {
  let chartData = [];
  if (statusData && statusData.length > 0) {
    chartData = statusData.map(item => ({
      value: item.percentage || 10,
      name: item.label_ru,
      itemStyle: {
        color: getColor(item.label_ru)
      }
    }));
  }
  return {
    title: [
      {
        text: `Общее количество \n статусов: ${totalStatusCount.value}`,
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
  let callDurations = [];

  if (dayData && dayData.length > 0) {
    dayData.forEach(item => {
      days.push(item.day);
      callCounts.push(item.call_count);
      callDurations.push(item.duration);
    });
  }
  return {
    title: [
      {
        text: `Общее количество звонков: ${totalDayCount.value}`,
        left: 'left',
        top: '5px',
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold'
        }
      }
    ],
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        const data = params[0];
        const day = data.axisValue;
        const duration = data.value;
        return `${day}<br/>${duration} минут`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '60px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: days,
      axisLine: {
        lineStyle: {
          color: '#ccc'
        }
      },
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
       min: 0,
      max: 25,
      interval: 5,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#eee'
        }
      }
    },
    series: [
            {
        type: 'line',
        data: callDurations,
        smooth: true,
        symbol: 'emptyCircle',
        symbolSize: 8,
        itemStyle: {
          color: '#5470c6'
        },
        lineStyle: {
          width: 3,
          color: '#5470c6'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(84, 112, 198, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(84, 112, 198, 0.1)'
              }
            ]
          }
        },
        markPoint: {
          data: [
            { type: 'max', name: 'Максимум' }
          ]
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