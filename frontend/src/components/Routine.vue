<template>
  <div>
    <h2>ルーティン入力</h2>
    <v-form @submit.prevent="submitRoutine">
      <v-text-field v-model="form.date" label="日付" type="date"></v-text-field>
      <v-select v-model="form.sleep_before_midnight" :items="binary" label="０時までに寝たか"></v-select>
      <v-select v-model="form.sleep_quality" :items="quality" label="睡眠の質"></v-select>
      <v-select v-model="form.sunlight_before_nine" :items="binary" label="朝日（九時まで）を浴びたか"></v-select>
      <v-select v-model="form.active_exercise" :items="binary" label="10分間の能動的運動"></v-select>
      <v-select v-model="form.conversation" :items="binary" label="誰かとの会話"></v-select>
      <v-select v-model="form.alcohol" :items="alcoholOpts" label="アルコール"></v-select>
      <v-select v-model="form.main_focus" :items="focuses" label="今日の主軸"></v-select>
      <v-select v-model="form.mood" :items="quality" label="気分"></v-select>
      <v-btn type="submit" class="mt-2" color="primary">保存</v-btn>
    </v-form>

    <h2 class="mt-6">過去一週間のレビュー</h2>
    <v-table v-if="weekData.length">
      <thead>
        <tr>
          <th>日付</th>
          <th v-for="m in metrics" :key="m.key">{{ m.label }}</th>
          <th>主軸</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in weekData" :key="entry.date">
          <td>{{ entry.date }}</td>
          <td v-for="m in metrics" :key="m.key">{{ entry[m.key] }}</td>
          <td>{{ entry.main_focus }}</td>
        </tr>
      </tbody>
    </v-table>

    <h3 class="mt-6">ヒートマップ</h3>
    <div v-for="m in metrics" :key="m.key" class="mb-2">
      <div>{{ m.label }}</div>
      <div class="heatmap">
        <div v-for="entry in weekData" :key="entry.date" class="cell" :style="{ backgroundColor: heatColor(entry[m.key]) }"></div>
      </div>
    </div>

    <h3 class="mt-6">一週間の頻度推移</h3>
    <div v-for="m in metrics" :key="m.key">
      {{ m.label }}: {{ frequency(m.key) }}
    </div>
    <div class="mt-2">
      主軸:
      <span v-for="f in focuses" :key="f">{{ f }} {{ focusCount(f) }} </span>
    </div>
  </div>
</template>

<script>
import api from '../axios';

export default {
  data() {
    return {
      binary: [0, 1],
      quality: [0, 1, 2],
      alcoholOpts: [0, -1],
      focuses: ['仕事','勉強','家事','運動','休養','創作','交友'],
      form: {
        date: new Date().toISOString().slice(0,10),
        sleep_before_midnight: 0,
        sleep_quality: 0,
        sunlight_before_nine: 0,
        active_exercise: 0,
        conversation: 0,
        alcohol: 0,
        main_focus: '仕事',
        mood: 0,
      },
      weekData: [],
    }
  },
  computed: {
    metrics() {
      return [
        { key: 'sleep_before_midnight', label: '０時までに寝たか' },
        { key: 'sleep_quality', label: '睡眠の質' },
        { key: 'sunlight_before_nine', label: '朝日（九時まで）を浴びたか' },
        { key: 'active_exercise', label: '10分間の能動的運動' },
        { key: 'conversation', label: '誰かとの会話' },
        { key: 'alcohol', label: 'アルコール' },
        { key: 'mood', label: '気分' },
      ];
    },
  },
  methods: {
    fetchWeek() {
      api.get('/routines/week').then(res => {
        this.weekData = res.data;
      });
    },
    submitRoutine() {
      api.post('/routines', this.form).then(() => {
        this.fetchWeek();
      });
    },
    heatColor(value) {
      const colors = ['#eee','#90caf9','#1976d2','#0d47a1'];
      return colors[Number(value)] || '#eee';
    },
    frequency(key) {
      return this.weekData.reduce((sum, item) => sum + (Number(item[key]) > 0 ? Number(item[key]) : 0), 0);
    },
    focusCount(f) {
      return this.weekData.filter(item => item.main_focus === f).length;
    }
  },
  mounted() {
    this.fetchWeek();
  }
}
</script>

<style scoped>
.heatmap {
  display: flex;
}
.cell {
  width: 20px;
  height: 20px;
  margin-right: 4px;
}
</style>
