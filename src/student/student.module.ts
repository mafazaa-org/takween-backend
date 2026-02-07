import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { Student, StudentSchema } from './student.schema';
import { Entity, EntitySchema } from '../entity/entity.schema';
import { Classroom, ClassroomSchema } from '../classroom/classroom.schema';
import { Attendance, AttendanceSchema } from '../attendance/attendance.schema';
import { Sitting, SittingSchema } from '../sitting/sitting.schema';
import { Activity, ActivitySchema } from '../activity/activity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Entity.name, schema: EntitySchema },
      { name: Classroom.name, schema: ClassroomSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Sitting.name, schema: SittingSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
