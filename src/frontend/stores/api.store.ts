import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useApi = defineStore('api', () => {
  const loadingCount = ref(0);

  const isLoading = computed(() => loadingCount.value > 0);

  async function callApi<T>(url: string): Promise<T> {
    loadingCount.value++;

    // the placeholder will be replaced on the fly by the api returnning the frontend code
    const response = await fetch(`{{API_URL_PLACEHOLDER}}/api/${url}`);
    const body = await response.json();

    loadingCount.value--;
    if (loadingCount.value < 0) {
      loadingCount.value = 0;
    }

    return body;
  }

  return { isLoading, callApi };
});
