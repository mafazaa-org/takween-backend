import { Controller, Post, Body, Get, Request, Put, Delete, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { PhoneRegisterDto } from './dto/phone-register.dto';
import { PhoneVerifyDto } from './dto/phone-verify.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/token/auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('phone/register')
    phoneRegister(@Body() phoneRegisterDto: PhoneRegisterDto) {
        return this.userService.phoneRegister(phoneRegisterDto);
    }

    @Post('phone/verify')
    @HttpCode(HttpStatus.OK)
    phoneVerify(@Body() phoneVerifyDto: PhoneVerifyDto) {
        return this.userService.phoneVerify(phoneVerifyDto);
    }

    @Get()
    @UseGuards(AuthGuard)
    getUser(@Request() req: any) {
        return this.userService.getUser(req.user.id);
    }

    @Put()
    @UseGuards(AuthGuard)
    updateUser(@Body() updateUserDto: UpdateUserDto, @Request() req: any) {
        return this.userService.update(req.user.id, updateUserDto);
    }

    @Delete()
    @UseGuards(AuthGuard)
    deleteUser(@Request() req: any) {
        return this.userService.delete(req.user.id);
    }
}
