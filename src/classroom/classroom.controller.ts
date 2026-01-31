import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  Delete,
  Post,
} from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import AddTeacherToClassroomDto from './dto/add-teacher-to-classroom.dto';
import { AddStudentToClassroomDto } from './dto/add-student-to-classroom.dto';
import { RemoveTeacherFromClassroomDto } from './dto/remove-teacher-from-classroom.dto';
import { RemoveStudentFromClassroomDto } from './dto/remove-student-from-classroom.dto';

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Get()
  getClassrooms() {
    return this.classroomService.getClassrooms();
  }

  @Post()
  createClassroom(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomService.createClassroom(createClassroomDto);
  }

  @Put(':id')
  updateClassroom(
    @Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.classroomService.updateClassroom(id, {
      name: updateClassroomDto.name,
    });
  }

  @Delete(':id')
  deleteClassroom(@Param('id') id: string) {
    return this.classroomService.deleteClassroom(id);
  }

  @Post(':id/add-teacher')
  addTeacherToClassroom(@Param('id') id: string, @Body() addTeacherToClassroomDto: AddTeacherToClassroomDto) {
    return this.classroomService.addTeacherToClassroom(id, addTeacherToClassroomDto);
  }

  @Post(':id/add-student')
  addStudentToClassroom(@Param('id') id: string, @Body() addStudentToClassroomDto: AddStudentToClassroomDto) {
    return this.classroomService.addStudentToClassroom(id, addStudentToClassroomDto);
  }

  @Delete(':id/remove-teacher')
  removeTeacherFromClassroom(@Param('id') id: string, @Body() removeTeacherFromClassroomDto: RemoveTeacherFromClassroomDto) {
    return this.classroomService.removeTeacherFromClassroom(id, removeTeacherFromClassroomDto);
  }

  @Delete(':id/remove-student')
  removeStudentFromClassroom(@Param('id') id: string, @Body() removeStudentFromClassroomDto: RemoveStudentFromClassroomDto) {
    return this.classroomService.removeStudentFromClassroom(id, removeStudentFromClassroomDto);
  }
}
