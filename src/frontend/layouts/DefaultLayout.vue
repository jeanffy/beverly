<script lang="ts" setup>
import LoadingComponent from '../components/LoadingComponent.vue';
import TopBarComponent from '../components/TopBarComponent.vue';
</script>

<template>
  <main>
    <LoadingComponent></LoadingComponent>
    <section id="top-bar">
      <TopBarComponent></TopBarComponent>
    </section>
    <section id="content-wrapper">
      <slot></slot>
    </section>
  </main>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;

  #top-bar {
    position: fixed;
    top: 0;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    background-color: $topbar-background-color;
  }

  #content-wrapper {
    margin-top: 50px;
    padding: 16px;
    width: fit-content;
  }
}
</style>
