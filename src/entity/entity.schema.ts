import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EntityDocument = Entity & Document;

@Schema({ timestamps: true })
export class Entity {
  @Prop({ required: true })
  name: string;

  // @Prop({ type: Types.ObjectId, ref: 'Admin', required: true, index: true })
  // ownerId: Types.ObjectId;
}

export const EntitySchema = SchemaFactory.createForClass(Entity);
