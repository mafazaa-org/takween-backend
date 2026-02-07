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
import { ScheduleService } from './schedule.service';
import { AuthGuard } from '../token/auth.guard';
import { UserTypeGuard } from '../user/user-type.guard';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Controller('schedule')
@UseGuards(AuthGuard, UserTypeGuard("sheikh", "admin", "teacher"))
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  createSchedule(
    @Body() createScheduleDto: CreateScheduleDto,
    @Request() req: any,
  ) {
    return this.scheduleService.createSchedule(createScheduleDto, req.user?.id as string);
  }

  @Get()
  getSchedules(@Request() req: any) {
    return this.scheduleService.getSchedules(req.user?.id as string);
  }

  @Get(':id')
  getSchedule(@Param('id') id: string, @Request() req: any) {
    return this.scheduleService.getScheduleById(id, req.user?.id as string);
  }

  @Get('activity/:activityId')
  getSchedulesForActivity(
    @Param('activityId') activityId: string,
    @Request() req: any,
  ) {
    return this.scheduleService.getSchedulesForActivity(activityId, req.user?.id as string);
  }

  @Put(':id')
  updateSchedule(
    @Param('id') id: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
    @Request() req: any,
  ) {
    return this.scheduleService.updateSchedule(id, updateScheduleDto, req.user?.id as string);
  }

  @Delete(':id')
  deleteSchedule(@Param('id') id: string, @Request() req: any) {
    return this.scheduleService.deleteSchedule(id, req.user?.id as string);
  }
}