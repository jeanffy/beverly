<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { PersistentVolumeDto } from '../../shared/dto';
import { useBreadcrumb } from '../stores/breadcrumb.store';
import JsonCodeComponent from '../components/JsonCodeComponent.vue';
import { useApi } from '../stores/api.store';

export interface PersistentVolumeViewPathNavParams {
  pvName: string;
}

export interface PersistentVolumeViewPathParams {
  contextName: string;
  pvName: string;
}

export interface PersistentVolumeViewBreadcrumbsVariables {
  contextName: string;
  pvName: string;
}

const route = useRoute();
const breadcrumb = useBreadcrumb();
const apiStore = useApi();

const pv = ref<PersistentVolumeDto>();

onMounted(async () => {
  const contextName = (route.params as unknown as PersistentVolumeViewPathParams).contextName;
  const pvName = (route.params as unknown as PersistentVolumeViewPathParams).pvName;
  pv.value = await apiStore.callApi(`contexts/${contextName}/pvs/${pvName}`);
  breadcrumb.populate<PersistentVolumeViewBreadcrumbsVariables>(route, {
    contextName,
    pvName: pvName,
  });
});
</script>

<template>
  <DefaultLayout>
    <template v-if="pv !== undefined">
      <h1>Persistent Volume <span class="codespan">{{ pv.metadata?.name }}</span></h1>

      <section name="metadata">
        <h2>Metadata</h2>
        <JsonCodeComponent :jsonObject="pv.metadata"></JsonCodeComponent>
      </section>

      <section name="spec">
        <h2>Spec</h2>
        <JsonCodeComponent :jsonObject="pv.spec"></JsonCodeComponent>
      </section>

      <section name="status">
        <h2>Status</h2>
        <JsonCodeComponent :jsonObject="pv.status"></JsonCodeComponent>
      </section>
    </template>
  </DefaultLayout>
</template>
