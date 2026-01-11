import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntityService } from './entity.service';
import { EntityController } from './entity.controller';
import { Entity, EntitySchema } from './entity.schema';
import { AdminModule } from '../admin/admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Entity.name, schema: EntitySchema }]),
    AdminModule,
  ],
  controllers: [EntityController],
  providers: [EntityService],
})
export class EntityModule {}
