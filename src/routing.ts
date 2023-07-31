export interface ContextParams {
  cluster: string;
}

export interface PersistentVolumeParams {
  cluster: string;
  pv: string;
}

export interface NamespaceParams {
  cluster: string;
  ns: string;
}

export interface DeploymentParams {
  cluster: string;
  ns: string;
  deployment: string;
}

export interface PodParams {
  cluster: string;
  ns: string;
  pod: string;
}

export interface ServiceParams {
  cluster: string;
  ns: string;
  service: string;
}

export interface IngressParams {
  cluster: string;
  ns: string;
  ingress: string;
}

export interface PersistentVolumeClaimParams {
  cluster: string;
  ns: string;
  pvc: string;
}

export namespace Routing {
  export function contexts(): string {
    return '/contexts';
  }

  export function context(cluster: string): string {
    return `/contexts/${cluster}`;
  }

  export function deployment(cluster: string, ns: string, deploymentName: string): string {
    return `/contexts/${cluster}/namespaces/${ns}/deployments/${deploymentName}`;
  }

  export function ingress(cluster: string, ns: string, ingressName: string): string {
    return `/contexts/${cluster}/namespaces/${ns}/ingresses/${ingressName}`;
  }

  export function namespace(cluster: string, ns: string): string {
    return `/contexts/${cluster}/namespaces/${ns}`;
  }

  export function persistentVolume(cluster: string, pv: string): string {
    return `/contexts/${cluster}/pvs/${pv}`;
  }

  export function persistentVolumeClaim(cluster: string, ns: string, pvc: string): string {
    return `/contexts/${cluster}/namespaces/${ns}/pvcs/${pvc}`;
  }

  export function pod(cluster: string, ns: string, podName: string): string {
    return `/contexts/${cluster}/namespaces/${ns}/pods/${podName}`;
  }

  export function service(cluster: string, ns: string, serviceName: string): string {
    return `/contexts/${cluster}/namespaces/${ns}/services/${serviceName}`;
  }
}
