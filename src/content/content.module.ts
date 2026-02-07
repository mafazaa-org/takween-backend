import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { Content, ContentSchema } from './content.schema';
import { Activity, ActivitySchema } from '../activity/activity.schema';
import { Entity, EntitySchema } from '../entity/entity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Content.name, schema: ContentSchema },
      { name: Activity.name, schema: ActivitySchema },
      { name: Entity.name, schema: EntitySchema },
    ]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule {}