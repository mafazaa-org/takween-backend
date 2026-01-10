import { Module } from '@nestjs/common';
import { EntityModule } from './entity/entity.module';
import { ActivityModule } from './activity/activity.module';
import { ClassroomModule } from './classroom/classroom.module';

@Module({
  imports: [EntityModule, ActivityModule, ClassroomModule],
})
export class AppModule {}
