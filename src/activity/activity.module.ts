import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Activity, ActivitySchema } from './activity.schema';
import { Entity, EntitySchema } from '../entity/entity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
      { name: Entity.name, schema: EntitySchema },
    ]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
