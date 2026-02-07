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
  Query,
} from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { AuthGuard } from '../token/auth.guard';
import { UserTypeGuard } from '../user/user-type.guard';

@Controller('homework')
@UseGuards(AuthGuard, UserTypeGuard("sheikh", "admin", "teacher"))
export class HomeworkController {
  constructor(private readonly homeworkService: HomeworkService) {}

  @Post()
  createHomework(
    @Body() createHomeworkDto: CreateHomeworkDto,
    @Request() req: any,
  ) {
    return this.homeworkService.createHomework(createHomeworkDto, req.user?.id as string);
  }

  @Get()
  getHomeworks(
    @Request() req: any,
    @Query('activityId') activityId?: string,
  ) {
    return this.homeworkService.getHomeworks(req.user?.id as string, activityId);
  }

  @Get(':id')
  getHomework(@Param('id') id: string, @Request() req: any) {
    return this.homeworkService.getHomeworkById(id, req.user?.id as string);
  }

  @Put(':id')
  updateHomework(
    @Param('id') id: string,
    @Body() updateHomeworkDto: UpdateHomeworkDto,
    @Request() req: any,
  ) {
    return this.homeworkService.updateHomework(id, updateHomeworkDto, req.user?.id as string);
  }

  @Delete(':id')
  deleteHomework(@Param('id') id: string, @Request() req: any) {
    return this.homeworkService.deleteHomework(id, req.user?.id as string);
  }
}