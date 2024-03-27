<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { PodDto } from '../../shared/dto';
import { useBreadcrumb } from '../stores/breadcrumb.store';
import { copyToClipboard, scrollToRouteHashIfNecessary } from '../utils';
import { Route } from '../router';
import ButtonComponent from '../components/ButtonComponent.vue';
import CodeSpanComponent from '../components/CodeSpanComponent.vue';
import JsonCodeComponent from '../components/JsonCodeComponent.vue';
import PanelComponent from '../components/PanelComponent.vue';
import { useApi } from '../stores/api.store';

export interface PodViewPathNavParams {
  podName: string;
}

export interface PodViewPathParams {
  contextName: string;
  nsName: string;
  podName: string;
}

export interface PodViewBreadcrumbsVariables {
  contextName: string;
  nsName: string;
  podName: string;
}

const route = useRoute();
const breadcrumb = useBreadcrumb();
const apiStore = useApi();

const pod = ref<PodDto>();

onMounted(async () => {
  const contextName = (route.params as unknown as PodViewPathParams).contextName;
  const nsName = (route.params as unknown as PodViewPathParams).nsName;
  const podName = (route.params as unknown as PodViewPathParams).podName;
  pod.value = await apiStore.callApi(`contexts/${contextName}/namespaces/${nsName}/pods/${podName}`);
  breadcrumb.populate<PodViewBreadcrumbsVariables>(route, {
    contextName,
    nsName,
    podName,
  });
});

watch(
  () => route.fullPath,
  () => scrollToRouteHashIfNecessary(route),
);
</script>

<template>
  <DefaultLayout>
    <template v-if="pod !== undefined">
      <h1>Pod <span class="codespan">{{ pod.metadata?.name }}</span></h1>

      <ul>
        <li><RouterLink :to="{ name: Route.Pod, hash: '#metadata' }">Metadata</RouterLink></li>
        <li><RouterLink :to="{ name: Route.Pod, hash: '#spec-containers' }">Spec - containers</RouterLink></li>
        <li><RouterLink :to="{ name: Route.Pod, hash: '#spec-volumes' }">Spec - volumes</RouterLink></li>
        <li><RouterLink :to="{ name: Route.Pod, hash: '#spec-other' }">Spec - other</RouterLink></li>
        <li><RouterLink :to="{ name: Route.Pod, hash: '#status' }">Status</RouterLink></li>
      </ul>

      <section id="commands">
        <PanelComponent>
          Get a prompt inside container<br/>
          <CodeSpanComponent>{{ pod.cmd.terminal }}</CodeSpanComponent>&nbsp;
          <ButtonComponent @buttonClicked="copyToClipboard(pod.cmd.terminal)">Copy</ButtonComponent>
        </PanelComponent>
        <PanelComponent>
          Display container logs<br/>
          <CodeSpanComponent>{{ pod.cmd.logs }}</CodeSpanComponent>&nbsp;
          <ButtonComponent @buttonClicked="copyToClipboard(pod.cmd.logs)">Copy</ButtonComponent>
          <br/>
          <CodeSpanComponent>{{ pod.cmd.logsWithTail }}</CodeSpanComponent>&nbsp;
          <ButtonComponent @buttonClicked="copyToClipboard(pod.cmd.logsWithTail)">Copy</ButtonComponent>
        </PanelComponent>
        <PanelComponent v-if="pod.cmd.portForward !== undefined">
          Port forward<br/>
          <CodeSpanComponent>{{ pod.cmd.portForward }}</CodeSpanComponent>&nbsp;
          <ButtonComponent @buttonClicked="copyToClipboard(pod.cmd.portForward)">Copy</ButtonComponent>
        </PanelComponent>
      </section>

      <section name="metadata">
        <h4>Metadata</h4>
        <JsonCodeComponent :jsonObject="pod.metadata"></JsonCodeComponent>
      </section>

      <section name="spec-containers">
        <h4>Spec - containers</h4>
        <JsonCodeComponent :jsonObject="pod.spec?.containers"></JsonCodeComponent>
      </section>

      <section name="spec-volumes">
        <h4>Spec - volumes</h4>
        <JsonCodeComponent :jsonObject="pod.spec?.volumes"></JsonCodeComponent>
      </section>

      <section name="spec-other">
        <h4>Spec - other</h4>
        <JsonCodeComponent :jsonObject="pod.spec"></JsonCodeComponent>
      </section>

      <section name="status">
        <h4>Status</h4>
        <JsonCodeComponent :jsonObject="pod.status"></JsonCodeComponent>
      </section>
    </template>
  </DefaultLayout>
</template>
