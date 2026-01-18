import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { AuthGuard } from 'src/token/auth.guard';
import { UserTypeGuard } from 'src/user/user-type.guard';

@Controller('activity')
  @UseGuards(AuthGuard, UserTypeGuard("admin"))
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  getActivities(@Query('entity') entity: string, @Request() req: any) {
    return this.activityService.getActivities(req.user?.id as string, entity);
  }

  @Post()
  createActivity(@Body() createActivityDto: CreateActivityDto, @Request() req: any) {
    return this.activityService.createActivity(createActivityDto, req.user?.id as string);
  }

  @Put(':id')
  updateActivity(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
    @Request() req: any
  ) {
    return this.activityService.updateActivity(id, updateActivityDto, req.user?.id as string);
  }

  @Delete(':id')
  deleteActivity(@Param('id') id: string, @Request() req: any) {
    return this.activityService.deleteActivity(id, req.user?.id as string);
  }
}
