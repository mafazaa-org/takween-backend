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
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  getActivities() {
    return this.activityService.getActivities();
  }

  @Post()
  createActivity(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.createActivity({
      name: createActivityDto.name,
      entityId: createActivityDto.entityId,
      customFields: createActivityDto.customFields,
    });
  }

  @Put(':id')
  updateActivity(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activityService.updateActivity(id, {
      name: updateActivityDto.name,
      customFields: updateActivityDto.customFields,
    });
  }

  @Delete(':id')
  deleteActivity(@Param('id') id: string) {
    return this.activityService.deleteActivity(id);
  }
}
