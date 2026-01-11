import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AuthGuard } from 'src/token/auth.guard';
import { AdminGuard } from './admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createAdminDto: RegisterAdminDto) {
    return this.adminService.register(createAdminDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginAdminDto: LoginAdminDto) {
    return this.adminService.login(loginAdminDto.phone);
  }

  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  getAdmin(@Request() req: any) {
    return this.adminService.getAdmin(req.user?._id);
  }

  @Put()
  @UseGuards(AuthGuard, AdminGuard)
  update(@Body() updateAdminDto: UpdateAdminDto, @Request() req: any) {
    return this.adminService.update(req.user?._id, updateAdminDto);
  }

  @Delete()
  @UseGuards(AuthGuard, AdminGuard)
  delete(@Request() req: any) {
    return this.adminService.delete(req.user?._id);
  }
}
