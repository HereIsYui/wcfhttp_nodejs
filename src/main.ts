import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LOGGER } from 'utils/logger';
import { configInfo as conf } from 'config/conf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(conf.port);
  LOGGER.Succ('IceNet Start at: ' + conf.port)
}
bootstrap();
