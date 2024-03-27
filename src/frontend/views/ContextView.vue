<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { ContextDto } from '../../shared/dto';
import { useBreadcrumb } from '../stores/breadcrumb.store';
import { Route } from '../router';
import { NamespaceViewPathNavParams } from './NamespaceView.vue';
import { PersistentVolumeViewPathNavParams } from './PersistentVolumeView.vue';
import CardComponent from '../components/CardComponent.vue';
import { useApi } from '../stores/api.store';

export interface ContextViewPathParams {
  contextName: string;
}

export interface ContextViewBreadcrumbsVariables {
  contextName: string;
}

const route = useRoute();
const breadcrumb = useBreadcrumb();
const apiStore = useApi();

const context = ref<ContextDto>();

onMounted(async () => {
  const contextName = (route.params as unknown as ContextViewPathParams).contextName;
  context.value = await apiStore.callApi(`contexts/${contextName}`);
  breadcrumb.populate<ContextViewBreadcrumbsVariables>(route, { contextName: context.value?.name ?? '' });
});
</script>

<template>
  <DefaultLayout>
    <template v-if="context !== undefined">
      <h1>
        Context <span class="codespan">{{ context.name }}</span>
      </h1>

      <CardComponent name="namespaces" title="Namespaces">
        <ul>
          <li v-for="ns in context.namespaces">
            <RouterLink
              :to="{ name: Route.Namespace, params: { nsName: ns.metadata?.name ?? '' } satisfies NamespaceViewPathNavParams }">
              {{ ns.metadata?.name }}
            </RouterLink>
          </li>
        </ul>
      </CardComponent>

      <CardComponent name="pvs" title="Persistent Volumes">
        <table>
          <tr v-for="pv in context.pvs">
            <td>
              <RouterLink
              :to="{ name: Route.PersistentVolume, params: { pvName: pv.metadata?.name ?? '' } satisfies PersistentVolumeViewPathNavParams }">
                {{ pv.metadata?.name }}
              </RouterLink>
            </td>
            <td>
              {{ pv.status?.phase }}
            </td>
          </tr>
        </table>
      </CardComponent>
    </template>
  </DefaultLayout>
</template>
