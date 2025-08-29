<template>
  <div>
    <v-card class="mx-auto my-4" max-width="600">
      <v-card-title>ウェルビーイング記録</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <div class="mb-2">
            <div>0時までに寝たか</div>
            <v-btn-toggle v-model="form.sleep_before_midnight" mandatory>
              <v-btn :value="1">○</v-btn>
              <v-btn :value="0">×</v-btn>
            </v-btn-toggle>
          </div>
          <div class="mb-2">
            <div>睡眠の質</div>
            <v-btn-toggle v-model="form.sleep_quality" mandatory>
              <v-btn :value="2">○</v-btn>
              <v-btn :value="1">△</v-btn>
              <v-btn :value="0">×</v-btn>
            </v-btn-toggle>
          </div>
          <div class="mb-2">
            <div>朝日（九時まで）を浴びたか</div>
            <v-btn-toggle v-model="form.morning_sun" mandatory>
              <v-btn :value="1">○</v-btn>
              <v-btn :value="0">×</v-btn>
            </v-btn-toggle>
          </div>
          <div class="mb-2">
            <div>10分間の能動的運動</div>
            <v-btn-toggle v-model="form.active_exercise" mandatory>
              <v-btn :value="1">○</v-btn>
              <v-btn :value="0">×</v-btn>
            </v-btn-toggle>
          </div>
          <div class="mb-2">
            <div>誰かとの会話</div>
            <v-btn-toggle v-model="form.conversation" mandatory>
              <v-btn :value="1">○</v-btn>
              <v-btn :value="0">×</v-btn>
            </v-btn-toggle>
          </div>
          <div class="mb-2">
            <div>アルコール</div>
            <v-btn-toggle v-model="form.alcohol" mandatory>
              <v-btn :value="0">無し</v-btn>
              <v-btn :value="-1">有り</v-btn>
            </v-btn-toggle>
          </div>
          <div class="mb-2">
            <div>今日の主軸</div>
            <v-btn-toggle v-model="form.main_focus" mandatory>
              <v-btn v-for="item in focusItems" :key="item" :value="item">{{ item }}</v-btn>
            </v-btn-toggle>
          </div>
          <div class="mb-2">
            <div>気分</div>
            <v-btn-toggle v-model="form.mood" mandatory>
              <v-btn :value="2">○</v-btn>
              <v-btn :value="1">△</v-btn>
              <v-btn :value="0">×</v-btn>
            </v-btn-toggle>
          </div>
          <v-btn type="submit" class="mt-4" block>記録</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <div v-if="records.length">
      <h2>過去一週間のレビュー</h2>
      <v-data-table :items="lastWeek" :headers="reviewHeaders" class="mb-8" />

      <h2>ヒートマップ</h2>
      <div class="heatmap mb-8">
        <table>
          <thead>
            <tr>
              <th>日付</th>
              <th v-for="d in dates" :key="d">{{ d }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>合計点</td>
              <td
                v-for="d in dates"
                :key="d"
                :style="totalCellStyle(d)"
              >
                {{ totalPoints(d) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>過去一週間の達成割合推移</h2>
      <div v-for="metric in ratioMetrics" :key="metric.key" class="mb-4">
        <div>{{ metric.label }}</div>
        <v-sparkline :model-value="ratioData(metric.key)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from '../axios';

const form = reactive({
  sleep_before_midnight: 0,
  sleep_quality: 0,
  morning_sun: 0,
  active_exercise: 0,
  conversation: 0,
  alcohol: 0,
  main_focus: '',
  mood: 0,
});

const focusItems = ['仕事', '勉強', '家事', '運動', '休養', '創作', '交友'];

const records = ref([]);

const reviewHeaders = [
  { title: '日付', value: 'date' },
  { title: '0時までに寝たか', value: 'sleep_before_midnight' },
  { title: '睡眠の質', value: 'sleep_quality' },
  { title: '朝日を浴びたか', value: 'morning_sun' },
  { title: '運動', value: 'active_exercise' },
  { title: '会話', value: 'conversation' },
  { title: 'アルコール', value: 'alcohol' },
  { title: '今日の主軸', value: 'main_focus' },
  { title: '気分', value: 'mood' },
];

const metrics = [
  { key: 'sleep_before_midnight', label: '0時までに寝たか' },
  { key: 'sleep_quality', label: '睡眠の質' },
  { key: 'morning_sun', label: '朝日を浴びたか' },
  { key: 'active_exercise', label: '運動' },
  { key: 'conversation', label: '会話' },
  { key: 'alcohol', label: 'アルコール' },
  { key: 'main_focus', label: '今日の主軸' },
  { key: 'mood', label: '気分' },
];

const ratioMetrics = metrics.filter(m => m.key !== 'main_focus');

const submit = async () => {
  try {
    await axios.post('/wellbeing', form, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    await fetchRecords();
  } catch (err) {
    console.error(err);
  }
};

const fetchRecords = async () => {
  try {
    const res = await axios.get('/wellbeing', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    records.value = res.data.records;
  } catch (err) {
    console.error(err);
  }
};

onMounted(fetchRecords);

const lastWeek = computed(() => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  return records.value.filter(r => new Date(r.date) >= weekAgo);
});

const dates = computed(() => {
  return records.value.map(r => r.date).sort();
});

const totalPoints = (date) => {
  const entry = records.value.find(r => r.date === date);
  if (!entry) return 0;
  let total =
    entry.sleep_before_midnight +
    entry.sleep_quality +
    entry.morning_sun +
    entry.active_exercise +
    entry.conversation +
    entry.mood;
  total += entry.alcohol === 0 ? 1 : 0;
  return total;
};

const totalCellStyle = (date) => {
  const total = totalPoints(date);
  const colors = ['#fff', '#e0f2f1', '#b2dfdb', '#80cbc4', '#4db6ac', '#26a69a', '#009688', '#00897b', '#00796b', '#00695c'];
  return { background: colors[total] || '#004d40' };
};

const ratioData = (key) => {
  const arr = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const entry = records.value.find(r => r.date === dateStr);
    if (entry) {
      let val = entry[key];
      if (key === 'alcohol') val = val === 0 ? 1 : 0;
      if (key === 'sleep_quality' || key === 'mood') val = val / 2;
      arr.push(val);
    } else {
      arr.push(0);
    }
  }
  return arr;
};
</script>

<style scoped>
.heatmap table {
  border-collapse: collapse;
}
.heatmap th,
.heatmap td {
  border: 1px solid #ccc;
  padding: 4px;
  text-align: center;
}
</style>

