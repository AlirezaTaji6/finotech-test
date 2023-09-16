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

describe('Send OTP  (e2e)', () => {
  let app: INestApplication;
  const baseUrl = '/api/authentication/otp/send';
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
    new ValidationTester(result.body.message).isFirstLayer(['email']);
  });

  it('Another user exists with this email', async () => {
    await userSeeder(repositoryHelper.repository);

    const result = await request(app.getHttpServer())
      .post(baseUrl)
      .send({
        email: testEmail,
      })
      .expect(HttpStatus.CONFLICT);

    expect(result.body.message).toBe(UserErrors.EMAIL_DUPLICATED);
  });

  it('ok', async () => {
    const cachingService = app.get(CachingService);
    const mailService = await app.resolve(MailService);
    mailService.sendConfirmation = jest.fn();
    const result = await request(app.getHttpServer())
      .post(baseUrl)
      .send({
        email: testEmail,
      })
      .expect(HttpStatus.OK);

    const { name } = RedisKeys.otp(testEmail);

    const savedData = await cachingService.get(name);
    expect(savedData).toBeDefined();
    expect(savedData).toBe(result.body.code);

    expect(mailService.sendConfirmation).toBeCalled();
  });
});
