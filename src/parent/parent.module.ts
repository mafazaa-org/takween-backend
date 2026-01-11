import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParentController } from './parent.controller';
import { ParentService } from './parent.service';
import { Parent, ParentSchema } from './parent.schema';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Parent.name, schema: ParentSchema },
    ]),
    StudentModule,
  ],
  controllers: [ParentController],
  providers: [ParentService],
})
export class ParentModule {}
