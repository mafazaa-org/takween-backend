import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance, AttendanceSchema } from './attendance.schema';
import { Student, StudentSchema } from '../student/student.schema';
import { Sitting, SittingSchema } from '../sitting/sitting.schema';
import { User, UserSchema } from '../user/user.schema';
import { Entity, EntitySchema } from '../entity/entity.schema';
import { Activity, ActivitySchema } from '../activity/activity.schema';
import { Classroom, ClassroomSchema } from '../classroom/classroom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Sitting.name, schema: SittingSchema },
      { name: User.name, schema: UserSchema },
      { name: Entity.name, schema: EntitySchema },
      { name: Activity.name, schema: ActivitySchema },
      { name: Classroom.name, schema: ClassroomSchema },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}