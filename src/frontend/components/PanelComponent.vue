<template>
  <div class="panel">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.panel {
  color: $panel-text-color;
  background-color: $panel-background-color;
  margin: $gutter 0;
  padding: $gutter;
  border-left: 5px solid $primary-color;
}
</style>
