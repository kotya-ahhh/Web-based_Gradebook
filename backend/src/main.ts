import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser());

  // Открываем двери для нашего React-фронтенда
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true, // Обязательно, чтобы передавались JWT-куки!
  });

  await app.listen(3000);
}
bootstrap();