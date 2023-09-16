import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { testEmail, testPassowrd } from './constants';

export async function testAuthenticator(
  app: INestApplication,
): Promise<string> {
  const result = await request(app.getHttpServer())
    .post('/api/authentication/login')
    .send({ email: testEmail, password: testPassowrd });

  return `Bearer ${result.body.accessToken}`;
}
