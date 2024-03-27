import { createRouter, createWebHistory } from 'vue-router';
import { ContextViewBreadcrumbsVariables } from '../views/ContextView.vue';
import { DeploymentViewBreadcrumbsVariables } from '../views/DeploymentView.vue';
import { IngressViewBreadcrumbsVariables } from '../views/IngressView.vue';
import { NamespaceViewBreadcrumbsVariables } from '../views/NamespaceView.vue';
import { PersistentVolumeClaimViewBreadcrumbsVariables } from '../views/PersistentVolumeClaimView.vue';
import { PersistentVolumeViewBreadcrumbsVariables } from '../views/PersistentVolumeView.vue';
import { PodViewBreadcrumbsVariables } from '../views/PodView.vue';
import { ServiceViewBreadcrumbsVariables } from '../views/ServiceView.vue';

export enum Route {
  Contexts = 'contexts',
  Context = 'context',
  Deployment = 'deployment',
  Ingress = 'ingress',
  Namespace = 'namespace',
  Pod = 'pod',
  PersistentVolume = 'persistent-volume',
  PersistentVolumeClaim = 'persistent-volume-claim',
  Service = 'service',
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: Route.Contexts },
    {
      path: '/contexts',
      meta: {
        breadcrumb: { text: 'Contexts' },
      },
      children: [
        {
          path: '',
          name: Route.Contexts,
          component: (): Promise<unknown> => import('../views/ContextsView.vue'),
          meta: {
            title: 'Contexts',
          },
        },
        {
          path: ':contextName',
          meta: {
            title: 'Context',
            breadcrumb: { variableName: 'contextName' satisfies keyof ContextViewBreadcrumbsVariables },
          },
          children: [
            {
              path: '',
              name: Route.Context,
              component: (): Promise<unknown> => import('../views/ContextView.vue'),
            },
            {
              path: 'namespaces',
              meta: {
                breadcrumb: { text: 'Namespaces', static: true },
              },
              children: [
                {
                  path: ':nsName',
                  meta: {
                    title: 'Namespace',
                    breadcrumb: { variableName: 'nsName' satisfies keyof NamespaceViewBreadcrumbsVariables },
                  },
                  children: [
                    {
                      path: '',
                      name: Route.Namespace,
                      component: (): Promise<unknown> => import('../views/NamespaceView.vue'),
                    },
                    {
                      path: 'deployments',
                      meta: {
                        title: 'Deployments',
                        breadcrumb: { text: 'Deployments', static: true },
                      },
                      children: [
                        {
                          path: ':deploymentName',
                          name: Route.Deployment,
                          component: (): Promise<unknown> => import('../views/DeploymentView.vue'),
                          meta: {
                            breadcrumb: {
                              variableName: 'deploymentName' satisfies keyof DeploymentViewBreadcrumbsVariables,
                            },
                          },
                        },
                      ],
                    },
                    {
                      path: 'pods',
                      meta: {
                        title: 'Pods',
                        breadcrumb: { text: 'Pods', static: true },
                      },
                      children: [
                        {
                          path: ':podName',
                          name: Route.Pod,
                          component: (): Promise<unknown> => import('../views/PodView.vue'),
                          meta: {
                            breadcrumb: { variableName: 'podName' satisfies keyof PodViewBreadcrumbsVariables },
                          },
                        },
                      ],
                    },
                    {
                      path: 'services',
                      meta: {
                        title: 'Services',
                        breadcrumb: { text: 'Services', static: true },
                      },
                      children: [
                        {
                          path: ':serviceName',
                          name: Route.Service,
                          component: (): Promise<unknown> => import('../views/ServiceView.vue'),
                          meta: {
                            breadcrumb: { variableName: 'serviceName' satisfies keyof ServiceViewBreadcrumbsVariables },
                          },
                        },
                      ],
                    },
                    {
                      path: 'ingresses',
                      meta: {
                        title: 'Ingresses',
                        breadcrumb: { text: 'Ingresses', static: true },
                      },
                      children: [
                        {
                          path: ':ingressName',
                          name: Route.Ingress,
                          component: (): Promise<unknown> => import('../views/IngressView.vue'),
                          meta: {
                            breadcrumb: { variableName: 'ingressName' satisfies keyof IngressViewBreadcrumbsVariables },
                          },
                        },
                      ],
                    },
                    {
                      path: 'pvcs',
                      meta: {
                        title: 'Persistent Volume Claims',
                        breadcrumb: { text: 'Persistent Volume Claims', static: true },
                      },
                      children: [
                        {
                          path: ':pvcName',
                          name: Route.PersistentVolumeClaim,
                          component: (): Promise<unknown> => import('../views/PersistentVolumeClaimView.vue'),
                          meta: {
                            breadcrumb: {
                              variableName: 'pvcName' satisfies keyof PersistentVolumeClaimViewBreadcrumbsVariables,
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              path: 'pvs',
              meta: {
                title: 'Persistent Volumes',
                breadcrumb: { text: 'Persistent Volumes', static: true },
              },
              children: [
                {
                  path: ':pvName',
                  name: Route.PersistentVolume,
                  component: (): Promise<unknown> => import('../views/PersistentVolumeView.vue'),
                  meta: {
                    breadcrumb: { variableName: 'pvName' satisfies keyof PersistentVolumeViewBreadcrumbsVariables },
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

export default router;
