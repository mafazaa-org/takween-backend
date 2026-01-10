import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  getActivities() {
    return this.activityService.getActivities();
  }

  @Post()
  createActivity(@Body() body: { name: string }) {
    return this.activityService.createActivity({ name: body.name });
  }

  @Put(':id')
  updateActivity(@Param('id') id: string, @Body() body: { name: string }) {
    return this.activityService.updateActivity(Number(id), { name: body.name });
  }

  @Delete(':id')
  deleteActivity(@Param('id') id: string) {
    return this.activityService.deleteActivity(Number(id));
  }
}
