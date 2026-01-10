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

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Get()
  getClassrooms() {
    return this.classroomService.getClassrooms();
  }

  @Post()
  createClassroom(@Body() body: { name: string }) {
    return this.classroomService.createClassroom({ name: body.name });
  }
  @Put(':id')
  updateClassroom(@Param('id') id: string, @Body() body: { name: string }) {
    return this.classroomService.updateClassroom(Number(id), {
      name: body.name,
    });
  }
  @Delete(':id')
  deleteClassroom(@Param('id') id: string) {
    return this.classroomService.deleteClassroom(Number(id));
  }
}
