import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const configSwagger = (app: INestApplication<any>) => {
  const config = new DocumentBuilder()
    .setTitle('Docs API')
    .setDescription('The docs API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
};

export default configSwagger;
