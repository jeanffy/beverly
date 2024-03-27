<template>
  <span class="codespan">
    <slot></slot>
  </span>
</template>

<style lang="scss" scoped>
.codespan {
  font-family: monospace;
  font-size: smaller;
  background-color: $codespan-background-color;
  color: $codespan-text-color;
  border-radius: $border-radius;
  padding: 2px 8px;
}
</style>
