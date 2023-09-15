import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { ParentEntity } from '../../database/entities/parent.entity';
import { User } from '../../users/entities/user.entity';

@Entity('products')
export class Product extends ParentEntity {
  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column()
  title: string;

  @Column()
  description: string;
}
