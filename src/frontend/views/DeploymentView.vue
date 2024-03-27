<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { DeploymentDto } from '../../shared/dto';
import { useBreadcrumb } from '../stores/breadcrumb.store';
import { scrollToRouteHashIfNecessary } from '../utils';
import JsonCodeComponent from '../components/JsonCodeComponent.vue';
import { Route } from '../router';
import { useApi } from '../stores/api.store';

export interface DeploymentViewPathNavParams {
  deploymentName: string;
}

export interface DeploymentViewPathParams {
  contextName: string;
  nsName: string;
  deploymentName: string;
}

export interface DeploymentViewBreadcrumbsVariables {
  contextName: string;
  nsName: string;
  deploymentName: string;
}

const route = useRoute();
const breadcrumb = useBreadcrumb();
const apiStore = useApi();

const deployment = ref<DeploymentDto>();

onMounted(async () => {
  const contextName = (route.params as unknown as DeploymentViewPathParams).contextName;
  const nsName = (route.params as unknown as DeploymentViewPathParams).nsName;
  const deploymentName = (route.params as unknown as DeploymentViewPathParams).deploymentName;
  deployment.value = await apiStore.callApi(`contexts/${contextName}/namespaces/${nsName}/deployments/${deploymentName}`);
  breadcrumb.populate<DeploymentViewBreadcrumbsVariables>(route, {
    contextName,
    nsName,
    deploymentName,
  });
  scrollToRouteHashIfNecessary(route);
});

watch(
  () => route.fullPath,
  () => scrollToRouteHashIfNecessary(route),
);
</script>

<template>
  <DefaultLayout>
    <template v-if="deployment !== undefined">
      <h1>Deployment <span class="codespan">{{ deployment.metadata?.name }}</span></h1>

      <div class="card">
        <div class="card-content">
          <ul>
            <li><RouterLink :to="{ name: Route.Deployment, hash: '#metadata' }">Metadata</RouterLink></li>
            <li><RouterLink :to="{ name: Route.Deployment, hash: '#spec' }">Spec</RouterLink></li>
            <li><RouterLink :to="{ name: Route.Deployment, hash: '#status' }">Status</RouterLink></li>
          </ul>
        </div>
      </div>

      <section name="metadata">
        <h2>Metadata</h2>
        <JsonCodeComponent :jsonObject="deployment.metadata"></JsonCodeComponent>
      </section>

      <section name="spec">
        <h2>Spec</h2>
        <JsonCodeComponent :jsonObject="deployment.spec"></JsonCodeComponent>
      </section>

      <section name="status">
        <h2>Status</h2>
        <JsonCodeComponent :jsonObject="deployment.status"></JsonCodeComponent>
      </section>
    </template>
  </DefaultLayout>
</template>
