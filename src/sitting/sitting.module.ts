import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SittingService } from './sitting.service';
import { SittingController } from './sitting.controller';
import { Sitting, SittingSchema } from './sitting.schema';
import { Classroom, ClassroomSchema } from 'src/classroom/classroom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Sitting.name, schema: SittingSchema },
      { name: Classroom.name, schema: ClassroomSchema },
    ]),
  ],
  providers: [SittingService],
  controllers: [SittingController],
  exports: [MongooseModule],
})
export class SittingModule { }
