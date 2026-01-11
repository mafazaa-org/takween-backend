import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassroomController } from './classroom.controller';
import { ClassroomService } from './classroom.service';
import { Classroom, ClassroomSchema } from './classroom.schema';
import { Activity, ActivitySchema } from '../activity/activity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Classroom.name, schema: ClassroomSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [ClassroomController],
  providers: [ClassroomService],
})
export class ClassroomModule {}
