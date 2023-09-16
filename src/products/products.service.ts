import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { IPaginatedData } from '../common/types';
import { SortDto } from '../common/dto/request';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create(
    createProductDto: CreateProductDto & { userId: number },
  ): Promise<Product> {
    return this.productRepository.save(
      this.productRepository.create(createProductDto),
    );
  }

  async findAll({
    page,
    limit,
    sort,
  }: SortDto): Promise<IPaginatedData<Product>> {
    const [data, count] = await this.productRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: sort,
    });
    return { data, count };
  }
}
