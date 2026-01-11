import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';

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
    return this.adminService.login(loginAdminDto.phone, loginAdminDto.password);
  }

  @Get()
  getAdmin() {
    return this.adminService.getAdmin();
  }

  @Put()
  update(@Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(updateAdminDto);
  }

  @Delete()
  delete() {
    return this.adminService.delete();
  }
}
