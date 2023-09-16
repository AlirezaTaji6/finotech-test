import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserErrors } from './enums';
import { UpdateUserDto } from './dto';
import { CommonErrors } from '../common/enums';
import { hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async findOne(id: number, required = false) {
    const userFound = await this.usersRepository.findOne({
      where: { id },
    });
    if (!userFound && required)
      throw new NotFoundException(UserErrors.NOT_FOUND);

    return userFound;
  }

  async isExistsByEmail(email: string): Promise<boolean> {
    const userFound = await this.usersRepository.findOne({
      where: {
        email,
      },
      select: ['id'],
    });
    return Boolean(userFound);
  }

  async create(email: string): Promise<User> {
    return this.usersRepository.save(this.usersRepository.create({ email }));
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    updateUserDto.password = await hash(
      updateUserDto.password,
      this.configService.get('app.hashSaltRounds'),
    );
    const result = await this.usersRepository.update(id, updateUserDto);
    if (!result.affected)
      throw new ServiceUnavailableException(CommonErrors.UPDATE_FAILED);
  }
}
