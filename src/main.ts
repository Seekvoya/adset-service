import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import EnvConfig from './config/envConfig';

async function bootstrap(port: number) {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: true,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.listen(port, '0.0.0.0', () =>
    // eslint-disable-next-line no-console
    console.log(`Server start on port: ${port}`),
  );
}

bootstrap(EnvConfig.app.port);
