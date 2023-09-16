import { HttpStatus, INestApplication, UnauthorizedException } from '@nestjs/common';
import { beforeAllUtil } from '../common/before-all';
import request from 'supertest';
import { RepositoryHelper } from '../common/repository-helper';
import { ValidationTester } from '../common/validation-tester';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { testAuthenticator } from '../common/authenticator';
import { userSeeder } from '../seeders/user-seeder';
import { testEmail } from '../common/constants';
import { compare } from 'bcrypt';

describe('Login (e2e)', () => {
  let app: INestApplication;
  const baseUrl = '/api/users';
  let repositoryHelper: RepositoryHelper;
  beforeAll(async () => {
    const result = await beforeAllUtil();
    app = result.app;

    const moduleFixture = result.moduleFixture;
    repositoryHelper = new RepositoryHelper(moduleFixture);
  });
  beforeEach(async () => {
    await repositoryHelper.clean();
    await userSeeder(repositoryHelper.repository);
  });
  afterEach(async () => {
    await repositoryHelper.clean();
  });

  it('Authentication failed', async () => {
    await request(app.getHttpServer())
      .put(baseUrl)
      .send({})
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('Validation failed', async () => {
    const token = await testAuthenticator(app);

    const result = await request(app.getHttpServer())
      .put(baseUrl)
      .set('Authorization', token)
      .send({})
      .expect(HttpStatus.BAD_REQUEST);
    new ValidationTester(result.body.message).isFirstLayer([
      'firstName',
      'lastName',
      'password',
    ]);
  });

  it('Validation failed', async () => {
    const token = await testAuthenticator(app);

    const firstName = 'test_first_name';
    const lastName = 'test_last_name';
    const password = 'changed_password';

    await request(app.getHttpServer())
      .put(baseUrl)
      .set('Authorization', token)
      .send({
        firstName,
        lastName,
        password,
      })
      .expect(HttpStatus.OK);

    const userFound = await repositoryHelper.repository.user.findOne({
      where: { email: testEmail },
    });
    expect(userFound.firstName).toBe(firstName);
    expect(userFound.lastName).toBe(lastName);
    const isPasswordChanged = await compare(password, userFound.password);
    expect(isPasswordChanged).toBe(true);
  });
});
