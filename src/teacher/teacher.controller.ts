import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { AuthGuard } from '../token/auth.guard';
import { UserTypeGuard } from '../user/user-type.guard';

@Controller('teacher')
@UseGuards(AuthGuard, UserTypeGuard("sheikh", "admin"))
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  createTeacher(
    @Body() createTeacherDto: {
      name: string;
      userId: string;
      entities?: string[];
      activities?: string[];
      specialization?: string;
    },
    @Request() req: any,
  ) {
    return this.teacherService.createTeacher(createTeacherDto, req.user?.id as string);
  }

  @Get()
  getTeachers(@Request() req: any) {
    return this.teacherService.getTeachers(req.user?.id as string);
  }

  @Get(':id')
  getTeacher(@Param('id') id: string, @Request() req: any) {
    return this.teacherService.getTeacherById(id, req.user?.id as string);
  }

  @Put(':id')
  updateTeacher(
    @Param('id') id: string,
    @Body() updateTeacherDto: {
      name?: string;
      entities?: string[];
      activities?: string[];
      specialization?: string;
      isActive?: boolean;
    },
    @Request() req: any,
  ) {
    return this.teacherService.updateTeacher(id, updateTeacherDto, req.user?.id as string);
  }

  @Delete(':id')
  deleteTeacher(@Param('id') id: string, @Request() req: any) {
    return this.teacherService.deleteTeacher(id, req.user?.id as string);
  }
}