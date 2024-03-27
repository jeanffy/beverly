import {
  V1Deployment,
  V1Ingress,
  V1Namespace,
  V1PersistentVolume,
  V1PersistentVolumeClaim,
  V1Pod,
  V1Service,
} from '@kubernetes/client-node';

export type DeploymentDto = V1Deployment;

export type PodInfoDto = V1Pod;

export interface PodDto extends V1Pod {
  cmd: {
    terminal: string;
    logs: string;
    logsWithTail: string;
    portForward?: string;
  };
}

export type ServiceDto = V1Service;
export type IngressDto = V1Ingress;
export type PersistentVolumeClaimDto = V1PersistentVolumeClaim;

export type PersistentVolumeDto = V1PersistentVolume;

export type NamespaceInfoDto = V1Namespace;

export interface NamespaceDto {
  contextName: string;
  name: string;
  deployments: DeploymentDto[];
  pods: PodInfoDto[];
  services: ServiceDto[];
  ingresses: V1Ingress[];
  pvcs: V1PersistentVolumeClaim[];
}

export interface ContextDto {
  name: string;
  namespaces: NamespaceInfoDto[];
  pvs: PersistentVolumeDto[];
}

export interface ContextInfoDto {
  name: string;
}
