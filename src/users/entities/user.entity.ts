import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { compare, hash } from 'bcrypt';
import { ParentEntity } from '../../database/entities/parent.entity';
import { appConfig } from '../../config';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class User extends ParentEntity {
  @Column()
  email: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  password?: string;

  @OneToMany(() => Product, (products) => products.user)
  products: Product[];

  private tempPassword: string;
  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && this.tempPassword !== this.password) {
      this.password = await hash(this.password, appConfig().hashSaltRounds);
    }
  }

  async isPasswordCorrect(rawPassword: string): Promise<boolean> {
    const isCorrect = await compare(rawPassword, this.password || '');
    return isCorrect;
  }
}
