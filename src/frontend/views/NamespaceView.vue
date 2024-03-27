<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { NamespaceDto } from '../../shared/dto';
import { useBreadcrumb } from '../stores/breadcrumb.store';
import { Route } from '../router';
import { DeploymentViewPathNavParams } from './DeploymentView.vue';
import { PodViewPathNavParams } from './PodView.vue';
import { ServiceViewPathNavParams } from './ServiceView.vue';
import { IngressViewPathNavParams } from './IngressView.vue';
import { PersistentVolumeClaimViewPathNavParams } from './PersistentVolumeClaimView.vue';
import CardComponent from '../components/CardComponent.vue';
import { useApi } from '../stores/api.store';

export interface NamespaceViewPathNavParams {
  nsName: string;
}

export interface NamespaceViewPathParams {
  contextName: string;
  nsName: string;
}

export interface NamespaceViewBreadcrumbsVariables {
  contextName: string;
  nsName: string;
}

const route = useRoute();
const breadcrumb = useBreadcrumb();
const apiStore = useApi();

const ns = ref<NamespaceDto>();

onMounted(async () => {
  const contextName = (route.params as unknown as NamespaceViewPathParams).contextName;
  const nsName = (route.params as unknown as NamespaceViewPathParams).nsName;
  ns.value = await apiStore.callApi(`contexts/${contextName}/namespaces/${nsName}`);
  breadcrumb.populate<NamespaceViewBreadcrumbsVariables>(route, {
    contextName,
    nsName: ns.value?.name ?? '',
  });
});
</script>

<template>
  <DefaultLayout>
    <template v-if="ns !== undefined">
      <h1>
        Namespace <span class="codespan">{{ ns.name }}</span>
      </h1>

      <main>

        <CardComponent name="deployments" title="Deployments">
          <table>
            <tr v-for="deployment in ns.deployments">
              <td>
                <RouterLink
                  :to="{ name: Route.Deployment, params: { deploymentName: deployment.metadata?.name ?? '' } satisfies DeploymentViewPathNavParams }">
                  {{ deployment.metadata?.name }}
                </RouterLink>
              </td>
              <td>
                {{ deployment.status?.availableReplicas }} / {{ deployment.status?.replicas }}
              </td>
            </tr>
          </table>
        </CardComponent>

        <CardComponent name="pods" title="Pods">
          <table>
            <tr v-for="pod in ns.pods">
              <td>
                <RouterLink
                  :to="{ name: Route.Pod, params: { podName: pod.metadata?.name ?? '' } satisfies PodViewPathNavParams }">
                  {{ pod.metadata?.name }}
                </RouterLink>
              </td>
              <td>
                {{ pod.status?.phase }}
              </td>
            </tr>
          </table>
        </CardComponent>

        <CardComponent name="services" title="Services">
          <table>
            <tr v-for="service in ns.services">
              <td>
                <RouterLink
                  :to="{ name: Route.Service, params: { serviceName: service.metadata?.name ?? '' } satisfies ServiceViewPathNavParams }">
                  {{ service.metadata?.name }}
                </RouterLink>
              </td>
              <td>
                {{ service.status?.conditions }}
              </td>
            </tr>
          </table>
        </CardComponent>

        <CardComponent name="ingresses" title="Ingresses">
          <table>
            <tr v-for="ingress in ns.ingresses">
              <td>
                <RouterLink
                  :to="{ name: Route.Ingress, params: { ingressName: ingress.metadata?.name ?? '' } satisfies IngressViewPathNavParams }">
                  {{ ingress.metadata?.name }}
                </RouterLink>
              </td>
            </tr>
          </table>
        </CardComponent>

        <CardComponent name="pvcs" title="Persistent Volume Claims">
          <table>
            <tr v-for="pvc in ns.pvcs">
              <td>
                <RouterLink
                  :to="{ name: Route.PersistentVolumeClaim, params: { pvcName: pvc.metadata?.name ?? '' } satisfies PersistentVolumeClaimViewPathNavParams }">
                  {{ pvc.metadata?.name }}
                </RouterLink>
              </td>
              <td>
                {{ pvc.status?.phase }}
              </td>
            </tr>
          </table>
        </CardComponent>

      </main>
    </template>
  </DefaultLayout>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  flex-wrap: wrap;
  gap: $gutter;
}
</style>
