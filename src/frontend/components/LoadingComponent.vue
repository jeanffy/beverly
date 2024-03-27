<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useApi } from '../stores/api.store';

const PROGRESSBAR_GRACE_PERIOD = 2000;

const apiStore = useApi();

const displayMessage = ref(false);
let timeout: number | undefined;

watch(
  () => apiStore.isLoading,
  isLoading => {
    if (isLoading) {
      if (timeout === undefined) {
        timeout = window.setTimeout(() => {
          displayMessage.value = true;
        }, PROGRESSBAR_GRACE_PERIOD);
      }
    } else {
      displayMessage.value = false;
      if (timeout !== undefined) {
        window.clearTimeout(timeout);
        timeout = undefined;
      }
    }
  }
);
</script>

<template>
  <div v-if="displayMessage" class="loading-container">
    <div class="progress-bar">
      <div class="progress-bar-value"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;

  .progress-bar {
    height: 4px;
    background-color: $progressbar-background-color;
    width: 100%;
    overflow: hidden;

    .progress-bar-value {
      width: 100%;
      height: 100%;
      background-color: $progressbar-color;
      animation: indeterminateAnimation 1s infinite linear;
      transform-origin: 0% 50%;
    }

    @keyframes indeterminateAnimation {
      0% {
        transform:  translateX(0) scaleX(0);
      }
      40% {
        transform:  translateX(0) scaleX(0.4);
      }
      100% {
        transform:  translateX(100%) scaleX(0.5);
      }
    }
  }
}
</style>
