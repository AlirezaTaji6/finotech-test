import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../authentication/guards';
import { GetUser } from '../common/decorators';
import { User } from '../users/entities/user.entity';
import { ProductResponse } from './dto/product.dto';
import { PaginatedResponse } from '../common/dto/response';
import { SortPipe } from '../common/pipes/sort.pipe';
import { SortFields } from '../common/enums';
import { SortDto } from '../common/dto/request';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(
    @GetUser() user: User,
    @Body() createProductDto: CreateProductDto,
  ) {
    const productInstance = await this.productsService.create({
      ...createProductDto,
      userId: user.id,
    });
    return new ProductResponse(productInstance);
  }

  @UsePipes(new SortPipe(SortFields))
  @Get()
  async findAll(@Query() { page, limit, sort }: SortDto) {
    const { data, count } = await this.productsService.findAll({
      page,
      limit,
      sort,
    });
    return new PaginatedResponse(
      data.map((setting) => new ProductResponse(setting)),
      limit,
      page,
      count,
    );
  }
}
