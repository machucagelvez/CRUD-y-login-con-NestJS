import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initSwagger } from './app.swagger';
import { SERVER_PORT } from './config/constants';
import { setDefaultUser } from './config/default-user';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger;
  const config = app.get(ConfigService)
  const port = parseInt(config.get<string>(SERVER_PORT), 10) || 3000

  initSwagger(app); //Inicia la documentación de la API
  setDefaultUser(config) //Crea el usuario por defecto

  app.useGlobalPipes(
      new ValidationPipe({
          whitelist: true //Esto hace que solo se usen los campos que se validan
      })
  )

  await app.listen(port);
  logger.log(`Server is running in ${await app.getUrl()}`)
}
bootstrap();
