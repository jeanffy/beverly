<script lang="ts" setup>
defineProps<{
  name?: string;
  title: string;
}>();
</script>

<template>
  <div :name="name" class="card">
    <div class="card-title">{{ title }}</div>
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  background-color: $card-background-color;
  color: $card-text-color;
  border: 1px solid darken($card-background-color, 10%);
  border-radius: $border-radius;
  min-width: 250px;
  margin-bottom: $gutter;

  .card-title {
    padding: $gutter $gutter 0 $gutter;
    font-size: larger;
  }

  .card-content {
    padding: $gutter $gutter $gutter $gutter;
  }
}
</style>
