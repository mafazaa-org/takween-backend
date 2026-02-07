import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { Teacher, TeacherSchema } from './teacher.schema';
import { User, UserSchema } from '../user/user.schema';
import { Entity, EntitySchema } from '../entity/entity.schema';
import { Activity, ActivitySchema } from '../activity/activity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Teacher.name, schema: TeacherSchema },
      { name: User.name, schema: UserSchema },
      { name: Entity.name, schema: EntitySchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [TeacherController],
  providers: [TeacherService],
  exports: [TeacherService],
})
export class TeacherModule {}