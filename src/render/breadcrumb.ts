import { Routing } from '../routing.js';
import { RenderCtx } from './render.context.js';

export interface BreadcrumbInfo {
  url: string;
  name: string;
}

export class Breadcrumb {
  public constructor(private ctx?: RenderCtx) {}

  public contexts(): BreadcrumbInfo[] {
    return [
      {
        url: '/',
        name: 'Contexts',
      },
    ];
  }

  public context(clusterName: string): BreadcrumbInfo[] {
    return [
      ...this.contexts(),
      {
        url: Routing.context(clusterName),
        name: clusterName,
      },
    ];
  }

  public persistentVolume(pvName: string): BreadcrumbInfo[] {
    if (this.ctx?.clusterName === undefined) {
      throw new Error('no clusterName');
    }
    return [
      ...this.context(this.ctx.clusterName),
      {
        url: Routing.persistentVolume(this.ctx.clusterName, pvName),
        name: `${pvName} (pv)`,
      },
    ];
  }

  public namespace(nsName: string): BreadcrumbInfo[] {
    if (this.ctx?.clusterName === undefined) {
      throw new Error('no clusterName');
    }
    return [
      ...this.context(this.ctx.clusterName),
      {
        url: Routing.namespace(this.ctx.clusterName, nsName),
        name: `${nsName} (namespace)`,
      },
    ];
  }

  public deployment(deploymentName: string): BreadcrumbInfo[] {
    if (this.ctx?.clusterName === undefined) {
      throw new Error('no clusterName');
    }
    if (this.ctx?.nsName === undefined) {
      throw new Error('no nsName');
    }
    return [
      ...this.namespace(this.ctx.nsName),
      {
        url: Routing.deployment(this.ctx.clusterName, this.ctx.nsName, deploymentName),
        name: `${deploymentName} (deployment)`,
      },
    ];
  }

  public pod(podName: string): BreadcrumbInfo[] {
    if (this.ctx?.clusterName === undefined) {
      throw new Error('no clusterName');
    }
    if (this.ctx?.nsName === undefined) {
      throw new Error('no nsName');
    }
    return [
      ...this.namespace(this.ctx.nsName),
      {
        url: Routing.pod(this.ctx.clusterName, this.ctx.nsName, podName),
        name: `${podName} (pod)`,
      },
    ];
  }

  public ingress(ingressName: string): BreadcrumbInfo[] {
    if (this.ctx?.clusterName === undefined) {
      throw new Error('no clusterName');
    }
    if (this.ctx?.nsName === undefined) {
      throw new Error('no nsName');
    }
    return [
      ...this.namespace(this.ctx.nsName),
      {
        url: Routing.ingress(this.ctx.clusterName, this.ctx.nsName, ingressName),
        name: `${ingressName} (ingress)`,
      },
    ];
  }

  public persistentVolumeClaim(pvcName: string): BreadcrumbInfo[] {
    if (this.ctx?.clusterName === undefined) {
      throw new Error('no clusterName');
    }
    if (this.ctx?.nsName === undefined) {
      throw new Error('no nsName');
    }
    return [
      ...this.namespace(this.ctx.nsName),
      {
        url: Routing.persistentVolumeClaim(this.ctx.clusterName, this.ctx.nsName, pvcName),
        name: `${pvcName} (pvc)`,
      },
    ];
  }

  public service(serviceName: string): BreadcrumbInfo[] {
    if (this.ctx?.clusterName === undefined) {
      throw new Error('no clusterName');
    }
    if (this.ctx?.nsName === undefined) {
      throw new Error('no nsName');
    }
    return [
      ...this.namespace(this.ctx.nsName),
      {
        url: Routing.service(this.ctx.clusterName, this.ctx.nsName, serviceName),
        name: `${serviceName} (service)`,
      },
    ];
  }
}
