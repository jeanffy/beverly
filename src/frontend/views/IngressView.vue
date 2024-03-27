<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { IngressDto } from '../../shared/dto';
import { useBreadcrumb } from '../stores/breadcrumb.store';
import JsonCodeComponent from '../components/JsonCodeComponent.vue';
import { useApi } from '../stores/api.store';

export interface IngressViewPathNavParams {
  ingressName: string;
}

export interface IngressViewPathParams {
  contextName: string;
  nsName: string;
  ingressName: string;
}

export interface IngressViewBreadcrumbsVariables {
  contextName: string;
  nsName: string;
  ingressName: string;
}

const route = useRoute();
const breadcrumb = useBreadcrumb();
const apiStore = useApi();

const ingress = ref<IngressDto>();

onMounted(async () => {
  const contextName = (route.params as unknown as IngressViewPathParams).contextName;
  const nsName = (route.params as unknown as IngressViewPathParams).nsName;
  const ingressName = (route.params as unknown as IngressViewPathParams).ingressName;
  ingress.value = await apiStore.callApi(`contexts/${contextName}/namespaces/${nsName}/ingresses/${ingressName}`);
  breadcrumb.populate<IngressViewBreadcrumbsVariables>(route, {
    contextName,
    nsName,
    ingressName: ingressName,
  });
});
</script>

<template>
  <DefaultLayout>
    <template v-if="ingress !== undefined">
      <h1>Ingress <span class="codespan">{{ ingress.metadata?.name }}</span></h1>

      <section name="metadata">
        <h2>Metadata</h2>
        <JsonCodeComponent :jsonObject="ingress.metadata"></JsonCodeComponent>
      </section>

      <section name="spec">
        <h2>Spec</h2>
        <JsonCodeComponent :jsonObject="ingress.spec"></JsonCodeComponent>
      </section>

      <section name="status">
        <h2>Status</h2>
        <JsonCodeComponent :jsonObject="ingress.status"></JsonCodeComponent>
      </section>
    </template>
  </DefaultLayout>
</template>
