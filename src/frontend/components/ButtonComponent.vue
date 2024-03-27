<script lang="ts" setup>
defineEmits<(event: 'buttonClicked') => void>();
</script>

<template>
  <button @click="$emit('buttonClicked')">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
button {
  background-color: $primary-color;
  color: white;
  border-radius: $border-radius;
  border: 1px solid $primary-color;
  padding: 0.5rem 1rem;

  &:hover {
    background-color: $accent-color;
    border: 1px solid $accent-color;
  }

  &:active {
    background-color: darken($primary-color, 10%);
    border: 1px solid darken($primary-color, 10%);
  }
}
</style>
