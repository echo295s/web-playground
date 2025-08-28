<template>
  <v-card class="mx-auto my-12" max-width="400">
    <v-card-title>アプリを選択</v-card-title>
    <v-card-text>
      <v-btn block class="mb-4" @click="$router.push('/chat')">チャット</v-btn>
      <v-btn block class="mb-4" @click="$router.push('/dummy1')">ダミーアプリ1</v-btn>
      <v-btn block @click="$router.push('/dummy2')">ダミーアプリ2</v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'AppSelection',
};
</script>

