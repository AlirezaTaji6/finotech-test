import { TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../src/products/entities/product.entity';
import { User } from '../../src/users/entities/user.entity';

export interface IRepository {
  user: Repository<User>;
  product: Repository<Product>;
}

export class RepositoryHelper {
  public readonly repository: IRepository;

  constructor(moduleFixture: TestingModule) {
    this.repository = {
      user: moduleFixture.get(getRepositoryToken(User)),
      product: moduleFixture.get(getRepositoryToken(Product)),
    };
  }

  async clean() {
    for await (const entity of Object.keys(this.repository).reverse()) {
      await this.repository[entity].delete({});
    }
  }
}
