<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import { ContextInfoDto } from '../../shared/dto';
import { Route } from '../router';
import { ContextViewPathParams } from './ContextView.vue';
import CardComponent from '../components/CardComponent.vue';
import { useApi } from '../stores/api.store';

const apiStore = useApi();
const contexts = ref<ContextInfoDto[]>();

onMounted(async () => {
  contexts.value = await apiStore.callApi('contexts');
});
</script>

<template>
  <DefaultLayout>
    <CardComponent v-if="contexts !== undefined" name="contexts" title="Contexts">
      <ul>
        <li v-for="context in contexts">
          <RouterLink :to="{ name: Route.Context, params: { contextName: context.name } satisfies ContextViewPathParams }">
            {{ context.name }}
          </RouterLink>
        </li>
      </ul>
    </CardComponent>
  </DefaultLayout>
</template>
