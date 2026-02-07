import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { Report, ReportSchema } from './report.schema';
import { Activity, ActivitySchema } from '../activity/activity.schema';
import { Entity, EntitySchema } from '../entity/entity.schema';
import { User, UserSchema } from '../user/user.schema';
import { Attendance, AttendanceSchema } from '../attendance/attendance.schema';
import { Student, StudentSchema } from '../student/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Report.name, schema: ReportSchema },
      { name: Activity.name, schema: ActivitySchema },
      { name: Entity.name, schema: EntitySchema },
      { name: User.name, schema: UserSchema },
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}