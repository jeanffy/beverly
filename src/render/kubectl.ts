import childProcess from 'node:child_process';
import util from 'node:util';
import { RenderCtx } from './render.context.js';

export class Kubectl {
  public constructor(private ctx?: RenderCtx) {}

  public async call<T>(cmd: string): Promise<T> {
    const cmdArgs = cmd.split(' ');
    cmdArgs.push('-o', 'json');
    if (this.ctx?.clusterName !== undefined) {
      cmdArgs.push('--context', this.ctx.clusterName);
    }
    if (this.ctx?.nsName !== undefined) {
      cmdArgs.push('-n', this.ctx.nsName);
    }

    const promiseExec = util.promisify(childProcess.exec);
    const { stdout } = await promiseExec(`kubectl ${cmdArgs.join(' ')}`);
    return JSON.parse(stdout);
  }
}
