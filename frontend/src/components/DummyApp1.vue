<template>
  <v-card class="mx-auto my-12" max-width="400">
    <v-card-title>ダミーアプリ1</v-card-title>
    <v-card-text>
      <div class="board">
        <div v-for="(row, y) in board" :key="`row-${y}`" class="row">
          <div
            v-for="(cell, x) in row"
            :key="`cell-${x}-${y}`"
            class="cell"
            :class="{ active: cell }"
            @click="toggleCell(x, y)"
          ></div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'DummyApp1',
  setup() {
    const size = 10;
    const board = ref(
      Array.from({ length: size }, () => Array(size).fill(0))
    );
    let ws;

    const toggleCell = (x, y) => {
      const value = board.value[y][x] ? 0 : 1;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'update', x, y, value }));
      }
    };

    onMounted(() => {
      ws = new WebSocket('ws://localhost:4000');
      ws.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'init') {
          board.value = data.board;
        } else if (data.type === 'update') {
          board.value[data.y][data.x] = data.value;
        }
      });
    });

    onBeforeUnmount(() => {
      if (ws) ws.close();
    });

    return { board, toggleCell };
  },
};
</script>

<style scoped>
.board {
  display: grid;
  grid-template-rows: repeat(10, 20px);
}
.row {
  display: grid;
  grid-template-columns: repeat(10, 20px);
}
.cell {
  width: 20px;
  height: 20px;
  border: 1px solid #ccc;
}
.cell.active {
  background-color: #1976d2;
}
</style>

