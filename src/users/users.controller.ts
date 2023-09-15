import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../authentication/guards';
import { GetUser } from '../common/decorators';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  async update(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.update(user.id, updateUserDto);
    return {};
  }
}
