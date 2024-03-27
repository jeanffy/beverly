<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { ServiceDto } from '../../shared/dto';
import { useBreadcrumb } from '../stores/breadcrumb.store';
import JsonCodeComponent from '../components/JsonCodeComponent.vue';
import { useApi } from '../stores/api.store';

export interface ServiceViewPathNavParams {
  serviceName: string;
}

export interface ServiceViewPathParams {
  contextName: string;
  nsName: string;
  serviceName: string;
}

export interface ServiceViewBreadcrumbsVariables {
  contextName: string;
  nsName: string;
  serviceName: string;
}

const route = useRoute();
const breadcrumb = useBreadcrumb();
const apiStore = useApi();

const service = ref<ServiceDto>();

onMounted(async () => {
  const contextName = (route.params as unknown as ServiceViewPathParams).contextName;
  const nsName = (route.params as unknown as ServiceViewPathParams).nsName;
  const serviceName = (route.params as unknown as ServiceViewPathParams).serviceName;
  service.value = await apiStore.callApi(`contexts/${contextName}/namespaces/${nsName}/services/${serviceName}`);
  breadcrumb.populate<ServiceViewBreadcrumbsVariables>(route, {
    contextName,
    nsName,
    serviceName,
  });
});

</script>

<template>
  <DefaultLayout>
    <template v-if="service !== undefined">
      <h1>
        Service <span class="codespan">{{ service.metadata?.name }}</span>
      </h1>

      <main>
        <section name="metadata">
          <h4>Metadata</h4>
          <JsonCodeComponent :jsonObject="service.metadata"></JsonCodeComponent>
        </section>

        <section name="spec">
          <h4>Spec</h4>
          <JsonCodeComponent :jsonObject="service.spec"></JsonCodeComponent>
        </section>
      </main>
    </template>
  </DefaultLayout>
</template>
