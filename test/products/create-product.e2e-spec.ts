import { HttpStatus, INestApplication } from '@nestjs/common';
import { beforeAllUtil } from '../common/before-all';
import request from 'supertest';
import { RepositoryHelper } from '../common/repository-helper';
import { ValidationTester } from '../common/validation-tester';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { testAuthenticator } from '../common/authenticator';
import { userSeeder } from '../seeders/user-seeder';
import { testEmail } from '../common/constants';
import { compare } from 'bcrypt';

describe('Create Product (e2e)', () => {
  let app: INestApplication;
  const baseUrl = '/api/products';
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
      .post(baseUrl)
      .send({})
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('Validation failed', async () => {
    const token = await testAuthenticator(app);

    const result = await request(app.getHttpServer())
      .post(baseUrl)
      .set('Authorization', token)
      .send({})
      .expect(HttpStatus.BAD_REQUEST);
    new ValidationTester(result.body.message).isFirstLayer([
      'title',
      'description',
    ]);
  });

  it('ok', async () => {
    const token = await testAuthenticator(app);

    const title = 'test_title';
    const description = 'test_description';

    await request(app.getHttpServer())
      .post(baseUrl)
      .set('Authorization', token)
      .send({
        title,
        description,
      })
      .expect(HttpStatus.CREATED);

    const productFound = await repositoryHelper.repository.product.findOne({
      where: {},
    });
    expect(productFound.title).toBe(title);
    expect(productFound.description).toBe(description);

    const userFound = await repositoryHelper.repository.user.findOne({
      where: { email: testEmail },
    });
    expect(userFound.id).toBe(productFound.userId);
  });
});
