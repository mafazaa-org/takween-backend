import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Activity, ActivityDocument } from './activity.schema';
import { Entity, EntityDocument } from '../entity/entity.schema';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
  ) { }

  async createActivity({
    name,
    entity,
    price,
  }: CreateActivityDto, userId: string) {
    const entityDoc = await this.entityModel.findById(entity).exec();
    if (!entityDoc)
      throw new NotFoundException(`الكيان بالمعرف ${entity} غير موجود`);
    if (entityDoc.owner.toString() !== userId) throw new ForbiddenException('لا يمكنك الوصول إلى هذا النشاط');
    return new this.activityModel({
      name,
      entity: new Types.ObjectId(entity),
      price: price ?? 0,
    }).save();
  }

  async getActivities(userId: string, entity?: string) {
    const entityDoc = await this.entityModel.findById(entity).exec();
    if (!entityDoc) throw new NotFoundException(`الكيان بالمعرف ${entity} غير موجود`);
    if (entityDoc.owner.toString() !== userId) throw new ForbiddenException('لا يمكنك الوصول إلى هذا النشاط');
    return this.activityModel.find({ entity: new Types.ObjectId(entity) }).exec();
  }

  async updateActivity(
    id: string,
    updateData: UpdateActivityDto, userId: string
  ) {
    const activityDoc = await this.activityModel.findById(id).populate<{ entity: EntityDocument }>('entity').exec();
    if (!activityDoc) throw new NotFoundException(`النشاط بالمعرف ${id} غير موجود`);
    if (activityDoc.entity.owner.toString() !== userId) throw new ForbiddenException('لا يمكنك الوصول إلى هذا النشاط');
    return this.activityModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async deleteActivity(id: string, userId: string) {
    const activityDoc = await this.activityModel.findById(id).populate<{ entity: EntityDocument }>('entity').exec();
    if (!activityDoc) throw new NotFoundException(`النشاط بالمعرف ${id} غير موجود`);
    if (activityDoc.entity.owner.toString() !== userId) throw new ForbiddenException('لا يمكنك الوصول إلى هذا النشاط');
    await this.activityModel.findByIdAndDelete(id).exec();
    return 'تم حذف النشاط بنجاح';
  }
}
