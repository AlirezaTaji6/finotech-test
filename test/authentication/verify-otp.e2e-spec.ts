import { HttpStatus, INestApplication } from '@nestjs/common';
import { beforeAllUtil } from '../common/before-all';
import request from 'supertest';
import { RepositoryHelper } from '../common/repository-helper';
import { ValidationTester } from '../common/validation-tester';
import { userSeeder } from '../seeders/user-seeder';
import { UserErrors } from '../../src/users/enums';
import { CachingService } from '../../src/common/lib/caching';
import { RedisKeys } from '../../src/common/constants/redis-keys.constant';
import { testEmail } from '../common/constants';
import { MailService } from '../../src/mail';
import { AuthenticationErrors } from '../../src/authentication/enums';
import { UserResponse } from '../../src/users/dto';

describe('Verify OTP (e2e)', () => {
  let app: INestApplication;
  const baseUrl = '/api/authentication/otp/verify';
  let repositoryHelper: RepositoryHelper;
  let cachingService: CachingService;
  beforeAll(async () => {
    const result = await beforeAllUtil();
    app = result.app;
    cachingService = app.get(CachingService);
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
      .get(baseUrl)
      .send({})
      .expect(HttpStatus.BAD_REQUEST);
    new ValidationTester(result.body.message).isFirstLayer(['email', 'code']);
  });

  it('Code does not exists', async () => {
    const result = await request(app.getHttpServer())
      .get(`${baseUrl}?email=${testEmail}&code=123456`)
      .expect(HttpStatus.UNAUTHORIZED);
    expect(result.body.message).toBe(AuthenticationErrors.INCORRECT_OTP);
  });

  it('Incorrect code', async () => {
    await request(app.getHttpServer()).post(baseUrl).send({
      email: testEmail,
    });
    const result = await request(app.getHttpServer())
      .get(`${baseUrl}?email=${testEmail}&code=123456`)
      .expect(HttpStatus.UNAUTHORIZED);

    expect(result.body.message).toBe(AuthenticationErrors.INCORRECT_OTP);
  });

  it('ok', async () => {
    const otpResponse = await request(app.getHttpServer())
      .post('/api/authentication/otp/send')
      .send({
        email: testEmail,
      });

    const result = await request(app.getHttpServer())
      .get(`${baseUrl}?email=${testEmail}&code=${otpResponse.body.code}`)
      .expect(HttpStatus.OK);

    expect(result.body.accessToken).toBeDefined();

    const userFound = await repositoryHelper.repository.user.findOne({
      where: { email: testEmail },
    });

    expect(new UserResponse(userFound)).toMatchObject(result.body.user);

    const { name } = RedisKeys.otp(testEmail);
    const savedCode = await cachingService.get(name);
    expect(savedCode).toBeNull();
  });
});
