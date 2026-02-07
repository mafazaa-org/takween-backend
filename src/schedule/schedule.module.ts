import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { Schedule, ScheduleSchema } from './schedule.schema';
import { Activity, ActivitySchema } from '../activity/activity.schema';
import { Entity, EntitySchema } from '../entity/entity.schema';
import { User, UserSchema } from '../user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
      { name: Activity.name, schema: ActivitySchema },
      { name: Entity.name, schema: EntitySchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}