<script lang="ts" setup>
import { useBreadcrumb } from '../stores/breadcrumb.store';

const breadcrumb = useBreadcrumb();
</script>

<template>
  <a class="app-title" href="/">Beverly 🔍</a>
  <div class="breadcrumb">
    <template v-for="(item, index) of breadcrumb.items">
      <span v-if="item.url === undefined">{{ item.text }}</span>
      <a v-else :href="item.url">{{ item.text }}</a>
      <template v-if="index < breadcrumb.items.length - 1">
        <span class="seperator">&rsaquo;</span>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.app-title {
  color: white;
  margin-right: 1rem;
}

.breadcrumb {
  color: white;

  span {
    padding: 0.3rem;

    &.seperator {
      font-size: larger;
    }
  }

  a {
    color: $topbar-text-color;
    text-decoration: underline;
  }
}

a {
  padding: 0.7rem 0.3rem;

  &:hover {
    background-color: darken($topbar-background-color, 10%);
    text-decoration: none;
  }
}
</style>
