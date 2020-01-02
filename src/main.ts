import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import Helmet from 'helmet'

import { AppModule } from './app.module'

declare const module: any
const baseurl = '/api'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix(baseurl)

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Plantacle REST API')
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        bearerFormat: 'JWT',
        description: 'Obtain an access token by posting to /api/auth',
      })
      .addTag('Authentication')
      .addTag('Users')
      .addTag('Measurements')
      .build(),
  )
  SwaggerModule.setup(`${baseurl}/swagger`, app, swaggerDocument, {
    swaggerOptions: {
      defaultModelsExpandDepth: 0,
      operationsSorter: 'method',
      displayRequestDuration: true,
    },
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false, value: false },
      exceptionFactory: (errors: ValidationError[]): BadRequestException =>
        new BadRequestException(errors, 'ValidationError'),
    }),
  )
  app.use(Helmet())

  await app.listen(3123)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose((): Promise<void> => app.close())
  }
}
bootstrap()
