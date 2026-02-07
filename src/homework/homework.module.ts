import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeworkController } from './homework.controller';
import { HomeworkService } from './homework.service';
import { Homework, HomeworkSchema } from './homework.schema';
import { Activity, ActivitySchema } from '../activity/activity.schema';
import { Entity, EntitySchema } from '../entity/entity.schema';
import { Student, StudentSchema } from '../student/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Homework.name, schema: HomeworkSchema },
      { name: Activity.name, schema: ActivitySchema },
      { name: Entity.name, schema: EntitySchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [HomeworkController],
  providers: [HomeworkService],
  exports: [HomeworkService],
})
export class HomeworkModule {}