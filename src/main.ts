import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

declare const module: any

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')

  await app.listen(3123)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose((): Promise<void> => app.close())
  }
}
bootstrap()
