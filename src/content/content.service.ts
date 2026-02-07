import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Content, ContentDocument } from './content.schema';
import { Activity, ActivityDocument } from '../activity/activity.schema';
import { Entity, EntityDocument } from '../entity/entity.schema';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<ContentDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
  ) {}

  async createContent(createContentDto: {
    title: string;
    description?: string;
    activityId: string;
    fileName: string;
    fileType: string;
    fileUrl: string;
    fileSize?: number;
    contentType?: string;
  }, ownerId: string) {
    // Verify activity exists and belongs to an entity owned by the user
    const activity = await this.activityModel.findById(createContentDto.activityId)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity) {
      throw new NotFoundException(`النشاط بالمعرف ${createContentDto.activityId} غير موجود`);
    }

    if (activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك إنشاء محتوى لنشاط لا تملكه');
    }

    const newContent = new this.contentModel({
      title: createContentDto.title,
      description: createContentDto.description,
      activity: new Types.ObjectId(createContentDto.activityId),
      fileName: createContentDto.fileName,
      fileType: createContentDto.fileType,
      fileUrl: createContentDto.fileUrl,
      fileSize: createContentDto.fileSize,
      contentType: createContentDto.contentType || 'document',
    });

    return newContent.save();
  }

  async getContent(ownerId: string, activityId?: string) {
    // Get all activities for entities owned by the user
    const entities = await this.entityModel.find({ owner: ownerId }).exec();
    const entityIds = entities.map(entity => entity._id);

    const activities = await this.activityModel.find({ entity: { $in: entityIds } }).exec();
    const activityIds = activities.map(activity => activity._id);

    const query: any = { activity: { $in: activityIds } };
    if (activityId) {
      query.activity = new Types.ObjectId(activityId);
    }

    return this.contentModel.find(query)
      .populate('activity')
      .exec();
  }

  async getContentById(id: string, ownerId: string) {
    const content = await this.contentModel.findById(id)
      .populate('activity')
      .exec();

    if (!content) {
      throw new NotFoundException(`المحتوى بالمعرف ${id} غير موجود`);
    }

    // Verify that the content's activity belongs to an entity owned by the user
    const activity = await this.activityModel.findById(content.activity._id)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك الوصول إلى هذا المحتوى');
    }

    return content;
  }

  async updateContent(id: string, updateData: Partial<{
    title: string;
    description: string;
    fileName: string;
    fileType: string;
    fileUrl: string;
    fileSize: number;
    contentType: string;
  }>, ownerId: string) {
    const content = await this.contentModel.findById(id).exec();
    if (!content) {
      throw new NotFoundException(`المحتوى بالمعرف ${id} غير موجود`);
    }

    // Verify that the content's activity belongs to an entity owned by the user
    const activity = await this.activityModel.findById(content.activity._id)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك تعديل هذا المحتوى');
    }

    return this.contentModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).exec();
  }

  async deleteContent(id: string, ownerId: string) {
    const content = await this.contentModel.findById(id).exec();
    if (!content) {
      throw new NotFoundException(`المحتوى بالمعرف ${id} غير موجود`);
    }

    // Verify that the content's activity belongs to an entity owned by the user
    const activity = await this.activityModel.findById(content.activity._id)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك حذف هذا المحتوى');
    }

    await this.contentModel.findByIdAndDelete(id).exec();
    return { message: 'تم حذف المحتوى بنجاح' };
  }
}