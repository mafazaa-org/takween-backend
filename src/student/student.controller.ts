import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  getStudents() {
    return this.studentService.getStudents();
  }

  @Get(':id')
  getStudent(@Param('id') id: string) {
    return this.studentService.getStudent(id);
  }

  @Post()
  createStudent(@Body() body: { name: string }) {
    return this.studentService.createStudent(body);
  }

  @Put(':id')
  updateStudent(@Param('id') id: string, @Body() body: { name?: string }) {
    return this.studentService.updateStudent(id, body);
  }

  @Delete(':id')
  deleteStudent(@Param('id') id: string) {
    return this.studentService.deleteStudent(id);
  }
}
