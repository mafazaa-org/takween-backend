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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { AuthGuard } from '../token/auth.guard';
import { UserTypeGuard } from '../user/user-type.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @UseGuards(AuthGuard, UserTypeGuard("sheikh", "admin", "teacher"))
  createStudent(
    @Body() createStudentDto: { name: string },
    @Request() req: any,
  ) {
    return this.studentService.createStudent(createStudentDto, req.user?.id as string);
  }

  @Get()
  @UseGuards(AuthGuard, UserTypeGuard("sheikh", "admin", "teacher"))
  getStudents(@Request() req: any) {
    return this.studentService.getStudents(req.user?.id as string);
  }

  @Get(':id')
  @UseGuards(AuthGuard, UserTypeGuard("sheikh", "admin", "teacher", "student"))
  getStudent(@Param('id') id: string, @Request() req: any) {
    // Students can only access their own record
    if (req.user.type === 'student') {
      if (req.user.studentId !== id) {
        throw new Error('لا يمكنك الوصول إلى بيانات طالب آخر');
      }
    }
    return this.studentService.getStudentById(id, req.user?.id as string);
  }

  @Put(':id')
  @UseGuards(AuthGuard, UserTypeGuard("sheikh", "admin", "teacher"))
  updateStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: { name?: string },
    @Request() req: any,
  ) {
    return this.studentService.updateStudent(id, updateStudentDto, req.user?.id as string);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, UserTypeGuard("sheikh", "admin", "teacher"))
  deleteStudent(@Param('id') id: string, @Request() req: any) {
    return this.studentService.deleteStudent(id, req.user?.id as string);
  }

  // Endpoint for students to register for activities
  @Post(':id/enroll/:activityId')
  @UseGuards(AuthGuard, UserTypeGuard("student"))
  enrollStudent(
    @Param('id') studentId: string,
    @Param('activityId') activityId: string,
    @Request() req: any,
  ) {
    // Students can only enroll themselves
    if (req.user.type === 'student' && req.user.studentId !== studentId) {
      throw new Error('لا يمكنك تسجيل طالب آخر');
    }
    return this.studentService.enrollStudent(studentId, activityId, req.user?.id as string);
  }

  // Endpoint for students to view their own attendance
  @Get(':id/attendance')
  @UseGuards(AuthGuard, UserTypeGuard("sheikh", "admin", "teacher", "student"))
  getStudentAttendance(
    @Param('id') studentId: string,
    @Request() req: any,
  ) {
    // Students can only view their own attendance
    if (req.user.type === 'student') {
      if (req.user.studentId !== studentId) {
        throw new Error('لا يمكنك عرض حضور طالب آخر');
      }
    }
    return this.studentService.getAttendance(studentId, req.user?.id as string);
  }
}