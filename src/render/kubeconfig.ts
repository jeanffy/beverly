import fs from 'node:fs/promises';
import path from 'node:path';
import { KubeConfig } from '@kubernetes/client-node';
import jsYaml from 'js-yaml';

export async function getKubeConfig(): Promise<KubeConfig> {
  const kubeConfigPath = path.join(process.env.HOME ?? '', '.kube/config');
  const kubeConfigContent = await fs.readFile(kubeConfigPath, { encoding: 'utf-8' });
  const kubeConfig = jsYaml.load(kubeConfigContent);
  return kubeConfig as KubeConfig;
}
