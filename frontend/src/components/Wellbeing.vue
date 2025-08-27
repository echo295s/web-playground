<template>
  <div>
    <h2>ウェルビーイング記録</h2>
    <v-form @submit.prevent="submitEntry">
      <v-checkbox label="0時までに寝たか" v-model="form.sleepBeforeMidnight" :true-value="1" :false-value="0"></v-checkbox>
      <v-select :items="sleepQualityOptions" label="睡眠の質" v-model="form.sleepQuality"></v-select>
      <v-checkbox label="朝日（九時まで）を浴びたか" v-model="form.morningSunlight" :true-value="1" :false-value="0"></v-checkbox>
      <v-checkbox label="10分間の能動的運動" v-model="form.activeExercise" :true-value="1" :false-value="0"></v-checkbox>
      <v-checkbox label="誰かとの会話" v-model="form.conversation" :true-value="1" :false-value="0"></v-checkbox>
      <v-checkbox label="アルコール" v-model="alcoholChecked"></v-checkbox>
      <v-select :items="focusOptions" label="今日の主軸" v-model="form.mainFocus"></v-select>
      <v-select :items="moodOptions" label="気分" v-model="form.mood"></v-select>
      <v-btn type="submit" color="primary" class="mt-4">記録</v-btn>
    </v-form>

    <div v-if="summary.entries.length" class="mt-8">
      <h3>過去一週間のレビュー</h3>
      <v-table>
        <thead>
          <tr>
            <th>日付</th>
            <th>主軸</th>
            <th>気分</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in summary.entries" :key="e.id">
            <td>{{ e.date }}</td>
            <td>{{ e.main_focus }}</td>
            <td>{{ e.mood }}</td>
          </tr>
        </tbody>
      </v-table>

      <h3 class="mt-8">ヒートマップ</h3>
      <div class="heatmap-year">
        <div class="week" v-for="(week, w) in heatmapWeeks" :key="w">
          <div
            v-for="day in week"
            :key="day.date"
            class="day"
            :title="day.date + ':' + day.score"
            :style="{ backgroundColor: scoreColor(day.score) }"
          ></div>
        </div>
      </div>

      <h3 class="mt-8">過去一週間の達成割合</h3>
      <ul>
        <li v-for="(ratio, key) in summary.ratios" :key="key">
          {{ itemLabel(key) }}: {{ (ratio * 100).toFixed(0) }}%
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import api from '../axios.js';

export default {
  name: 'Wellbeing',
  data() {
    return {
      form: {
        sleepBeforeMidnight: 0,
        sleepQuality: 0,
        morningSunlight: 0,
        activeExercise: 0,
        conversation: 0,
        alcohol: 0,
        mainFocus: '仕事',
        mood: 0,
      },
      summary: { entries: [], ratios: {}, heatmap: [] },
      sleepQualityOptions: [
        { title: '0', value: 0 },
        { title: '1', value: 1 },
        { title: '2', value: 2 },
      ],
      moodOptions: [
        { title: '0', value: 0 },
        { title: '1', value: 1 },
        { title: '2', value: 2 },
      ],
      focusOptions: ['仕事', '勉強', '家事', '運動', '休養', '創作', '交友'],
    };
  },
  computed: {
    alcoholChecked: {
      get() {
        return this.form.alcohol === -1;
      },
      set(val) {
        this.form.alcohol = val ? -1 : 0;
      },
    },
    heatmapWeeks() {
      const today = new Date();
      const start = new Date();
      start.setDate(today.getDate() - 7 * 52 + 1);
      const map = {};
      (this.summary.heatmap || []).forEach((h) => {
        map[h.date] = h.score;
      });
      const weeks = [];
      for (let w = 0; w < 52; w++) {
        const days = [];
        for (let d = 0; d < 7; d++) {
          const current = new Date(start);
          current.setDate(start.getDate() + w * 7 + d);
          const dateStr = current.toISOString().split('T')[0];
          days.push({ date: dateStr, score: map[dateStr] || 0 });
        }
        weeks.push(days);
      }
      return weeks;
    },
  },
  methods: {
    async submitEntry() {
      try {
        await api.post('/wellbeing', this.form);
        await this.loadSummary();
      } catch (err) {
        console.error(err);
      }
    },
    async loadSummary() {
      try {
        const res = await api.get('/wellbeing/summary');
        this.summary = res.data;
      } catch (err) {
        console.error(err);
      }
    },
    scoreColor(score) {
      if (score <= 0) return '#e0e0e0';
      if (score <= 2) return '#c8e6c9';
      if (score <= 4) return '#81c784';
      if (score <= 6) return '#4caf50';
      return '#1b5e20';
    },
    itemLabel(key) {
      const map = {
        sleep_before_midnight: '0時までに寝たか',
        sleep_quality: '睡眠の質',
        morning_sunlight: '朝日（九時まで）を浴びたか',
        active_exercise: '10分間の能動的運動',
        conversation: '誰かとの会話',
        alcohol: 'アルコール',
        mood: '気分',
      };
      return map[key] || key;
    },
  },
  mounted() {
    this.loadSummary();
  },
};
</script>

<style scoped>
.heatmap-year {
  display: flex;
}
.week {
  display: flex;
  flex-direction: column;
}
.day {
  width: 12px;
  height: 12px;
  margin: 1px;
}
</style>
