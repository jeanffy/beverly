<script lang="ts" setup>
import { computed } from 'vue';
import formatHighlight from 'json-format-highlight';

const props = defineProps<{
  jsonObject?: object;
}>();

const rawHtml = computed(() => getFormattedJson(props.jsonObject));

function getFormattedJson(raw: unknown): string {
  const html = JSON.stringify(raw, undefined, 2).replaceAll('\n', '<br/>').replaceAll(' ', '&nbsp;');
  const colors = {
    keyColor: '#2069a0',
    numberColor: '#b75301',
    stringColor: '#567a0d',
    trueColor: '#4B84B3',
    falseColor: '#4B84B3',
    nullColor: '#246ba1',
  };
  return formatHighlight(html, colors);
}
</script>

<template>
  <div class="code" v-html="rawHtml"></div>
</template>

<style lang="scss" scoped>
.code {
  font-family: monospace;
  font-size: smaller;
  background-color: $code-background-color;
  color: $code-text-color;
  border: 1px solid darken($code-background-color, 15%);
  padding: $gutter;
  margin: $gutter 0;
  min-width: 800px;
  max-width: 800px;
  max-height: 500px;
  overflow: scroll;
  text-wrap: nowrap;
}
</style>
