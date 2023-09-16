import { HttpStatus, INestApplication } from '@nestjs/common';
import { beforeAllUtil } from '../common/before-all';
import request from 'supertest';
import { RepositoryHelper } from '../common/repository-helper';
import { ValidationTester } from '../common/validation-tester';
import { userSeeder } from '../seeders/user-seeder';
import { UserErrors } from '../../src/users/enums';
import { CachingService } from '../../src/common/lib/caching';
import { RedisKeys } from '../../src/common/constants/redis-keys.constant';
import { testEmail, testPassowrd } from '../common/constants';
import { MailService } from '../../src/mail';
import { AuthenticationErrors } from '../../src/authentication/enums';
import { UserResponse } from '../../src/users/dto';

describe('Login (e2e)', () => {
  let app: INestApplication;
  const baseUrl = '/api/authentication/login';
  let repositoryHelper: RepositoryHelper;
  beforeAll(async () => {
    const result = await beforeAllUtil();
    app = result.app;

    const moduleFixture = result.moduleFixture;
    repositoryHelper = new RepositoryHelper(moduleFixture);
  });
  beforeEach(async () => {
    await repositoryHelper.clean();
  });
  afterEach(async () => {
    await repositoryHelper.clean();
  });

  it('Validation failed', async () => {
    const result = await request(app.getHttpServer())
      .post(baseUrl)
      .send({})
      .expect(HttpStatus.BAD_REQUEST);
    new ValidationTester(result.body.message).isFirstLayer([
      'email',
      'password',
    ]);
  });

  it('User not found', async () => {
    const result = await request(app.getHttpServer())
      .post(baseUrl)
      .send({
        email: testEmail,
        password: testPassowrd,
      })
      .expect(HttpStatus.UNAUTHORIZED);
    expect(result.body.message).toBe(AuthenticationErrors.INVALID_CREDINTIALS);
  });

  it('Password incorrect', async () => {
    await userSeeder(repositoryHelper.repository);

    const result = await request(app.getHttpServer())
      .post(baseUrl)
      .send({
        email: testEmail,
        password: 'incorrect',
      })
      .expect(HttpStatus.UNAUTHORIZED);
    expect(result.body.message).toBe(AuthenticationErrors.INVALID_CREDINTIALS);
  });

  it('ok', async () => {
    await userSeeder(repositoryHelper.repository);

    const result = await request(app.getHttpServer())
      .post(baseUrl)
      .send({
        email: testEmail,
        password: testPassowrd,
      })
      .expect(HttpStatus.OK);

    expect(result.body.accessToken).toBeDefined();

    const userFound = await repositoryHelper.repository.user.findOne({
      where: { email: testEmail },
    });

    expect(new UserResponse(userFound)).toMatchObject(result.body.user);
  });
});
