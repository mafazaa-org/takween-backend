import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';
import { Evaluation, EvaluationSchema } from './evaluation.schema';
import { Student, StudentSchema } from '../student/student.schema';
import { Activity, ActivitySchema } from '../activity/activity.schema';
import { Entity, EntitySchema } from '../entity/entity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Evaluation.name, schema: EvaluationSchema },
      { name: Student.name, schema: StudentSchema },
      { name: Activity.name, schema: ActivitySchema },
      { name: Entity.name, schema: EntitySchema },
    ]),
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
  exports: [EvaluationService],
})
export class EvaluationModule {}