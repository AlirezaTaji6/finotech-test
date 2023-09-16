import { hash } from 'bcrypt';
import { testEmail, testPassowrd } from '../common/constants';
import { IRepository } from '../common/repository-helper';

export async function userSeeder(repository: IRepository) {
  const user = await repository.user.save(
    repository.user.create({
      email: testEmail,
      password: testPassowrd,
    }),
  );

  return user;
}
