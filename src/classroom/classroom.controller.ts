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

@Controller('classroom')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Get()
  getClassrooms() {
    return this.classroomService.getClassrooms();
  }

  @Post()
  createClassroom(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomService.createClassroom({
      name: createClassroomDto.name,
      activityId: createClassroomDto.activityId,
      customFields: createClassroomDto.customFields,
    });
  }

  @Put(':id')
  updateClassroom(
    @Param('id') id: string,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.classroomService.updateClassroom(id, {
      name: updateClassroomDto.name,
      customFields: updateClassroomDto.customFields,
    });
  }

  @Delete(':id')
  deleteClassroom(@Param('id') id: string) {
    return this.classroomService.deleteClassroom(id);
  }
}
