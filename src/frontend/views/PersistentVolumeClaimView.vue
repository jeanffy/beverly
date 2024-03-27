<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { PersistentVolumeClaimDto } from '../../shared/dto';
import { useBreadcrumb } from '../stores/breadcrumb.store';
import JsonCodeComponent from '../components/JsonCodeComponent.vue';
import { useApi } from '../stores/api.store';

export interface PersistentVolumeClaimViewPathNavParams {
  pvcName: string;
}

export interface PersistentVolumeClaimViewPathParams {
  contextName: string;
  nsName: string;
  pvcName: string;
}

export interface PersistentVolumeClaimViewBreadcrumbsVariables {
  contextName: string;
  nsName: string;
  pvcName: string;
}

const route = useRoute();
const breadcrumb = useBreadcrumb();
const apiStore = useApi();

const pvc = ref<PersistentVolumeClaimDto>();

onMounted(async () => {
  const contextName = (route.params as unknown as PersistentVolumeClaimViewPathParams).contextName;
  const nsName = (route.params as unknown as PersistentVolumeClaimViewPathParams).nsName;
  const pvcName = (route.params as unknown as PersistentVolumeClaimViewPathParams).pvcName;
  pvc.value = await apiStore.callApi(`contexts/${contextName}/namespaces/${nsName}/pvcs/${pvcName}`);
  breadcrumb.populate<PersistentVolumeClaimViewBreadcrumbsVariables>(route, {
    contextName,
    nsName,
    pvcName: pvcName,
  });
});
</script>

<template>
  <DefaultLayout>
    <template v-if="pvc !== undefined">
      <h1>Persistent Volume Claim <span class="codespan">{{ pvc.metadata?.name }}</span></h1>

      <section name="metadata">
        <h2>Metadata</h2>
        <JsonCodeComponent :jsonObject="pvc.metadata"></JsonCodeComponent>
      </section>

      <section name="spec">
        <h2>Spec</h2>
        <JsonCodeComponent :jsonObject="pvc.spec"></JsonCodeComponent>
      </section>

      <section name="status">
        <h2>Status</h2>
        <JsonCodeComponent :jsonObject="pvc.status"></JsonCodeComponent>
      </section>
    </template>
  </DefaultLayout>
</template>
