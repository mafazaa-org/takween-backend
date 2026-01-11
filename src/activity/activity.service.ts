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
    entityId,
    customFields,
  }: {
    name: string;
    entityId: string;
    customFields?: Record<string, any>;
  }) {
    const entity = await this.entityModel.findById(entityId).exec();
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${entityId} not found`);
    }

    const activity = new this.activityModel({
      name,
      entityId: new Types.ObjectId(entityId),
      customFields: customFields || {},
    });
    return activity.save();
  }

  async getActivities(entityId?: string) {
    const query = entityId ? { entityId: new Types.ObjectId(entityId) } : {};
    return this.activityModel.find(query).exec();
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
    return 'Activity deleted successfully';
  }
}
