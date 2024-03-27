import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';
import { Request, Response, Router } from 'express';
import { ConfigProvider } from './providers/config.provider.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

function routerFrontend(configProvider: ConfigProvider): Router {
  const router = Router();

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get('/assets/*', async (req: Request, res: Response): Promise<void> => {
    const filePath = path.join(__dirname, '..', 'frontend', req.originalUrl);
    const fileExtension = path.parse(req.originalUrl).ext;
    if (fileExtension === '.js') {
      let fileContent = await fs.readFile(filePath, { encoding: 'utf-8' });
      fileContent = fileContent.replaceAll('{{API_URL_PLACEHOLDER}}', `http://localhost:${configProvider.listenPort}`);
      res.setHeader('content-type', 'text/javascript');
      res.send(fileContent);
    } else {
      res.sendFile(filePath);
    }
  });

  router.get('*', (_req: Request, res: Response): void => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
  });

  return router;
}

export default routerFrontend;
