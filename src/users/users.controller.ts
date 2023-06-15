import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserDto } from './dto/User.dto';
import { UsersService } from './users.service';
import { IUserOutputModel } from './interfaces/IUserOutput.model';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards';
import { Roles } from 'src/common/decorators';
import { EUserRoles } from 'src/common/enums';
import { IRequestWithUser } from 'src/common/interfaces';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('judge')
  @Roles(EUserRoles.ADMIN)
  @UseGuards(JwtAuthGuard)
  public createJudge(@Body() body: UserDto): Promise<string> {
    return this.userService.createUser(body, EUserRoles.JUDGE);
  }

  @Post('admin')
  @Roles(EUserRoles.ADMIN)
  @UseGuards(JwtAuthGuard)
  public createAdmin(@Body() body: UserDto): Promise<string> {
    return this.userService.createUser(body, EUserRoles.ADMIN);
  }

  @Get('me')
  @Roles(EUserRoles.ADMIN, EUserRoles.JUDGE, EUserRoles.SCREEN)
  @UseGuards(JwtAuthGuard)
  public me(@Req() req: IRequestWithUser): Promise<IUserOutputModel | null> {
    if (!req.user) {
      throw new Error('user not found');
    }

    return this.userService.findOne(req.user.id);
  }

  @Post('screen')
  @Roles(EUserRoles.ADMIN)
  @UseGuards(JwtAuthGuard)
  public createScreen(@Body() body: UserDto): Promise<string> {
    return this.userService.createUser(body, EUserRoles.SCREEN);
  }

  @Get(':id')
  public getUser(@Param('id') id: string): Promise<IUserOutputModel | null> {
    return this.userService.findOne(id);
  }
}
