import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activity, ActivityDocument } from './activity.schema';
import { Entity, EntityDocument } from '../entity/entity.schema';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
  ) {}

  async createActivity({
    name,
    entity,
    customFields,
  }: {
    name: string;
    entity: string;
    customFields?: Record<string, any>;
  }) {
    const entityDoc = await this.entityModel.findById(entity).exec();
    if (!entityDoc)
      throw new NotFoundException(`الكيان بالمعرف ${entity} غير موجود`);
    return new this.activityModel({
      name,
      entity: new Types.ObjectId(entity),
      customFields: customFields || {},
    }).save();
  }

  async getActivities(entity?: string) {
    return this.activityModel
      .find(entity ? { entity: new Types.ObjectId(entity) } : {})
      .exec();
  }

  async updateActivity(
    id: string,
    {
      name,
      customFields,
    }: { name?: string; customFields?: Record<string, any> },
  ) {
    const updateData: any = {};
    if (name) updateData.name = name;
    if (customFields) updateData.customFields = customFields;

    return this.activityModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async deleteActivity(id: string) {
    await this.activityModel.findByIdAndDelete(id).exec();
    return 'تم حذف النشاط بنجاح';
  }
}
