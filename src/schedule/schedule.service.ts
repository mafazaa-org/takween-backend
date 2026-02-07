import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Schedule, ScheduleDocument } from './schedule.schema';
import { Activity, ActivityDocument } from '../activity/activity.schema';
import { Entity, EntityDocument } from '../entity/entity.schema';
import { User, UserDocument } from '../user/user.schema';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createSchedule(createScheduleDto: {
    activityId: string;
    recurrenceType: string;
    daysOfWeek?: string[];
    startTime: Date;
    endTime: Date;
    startDate: Date;
    endDate?: Date;
    maxOccurrences?: number;
    description?: string;
  }, ownerId: string) {
    // Verify that the activity exists and belongs to an entity owned by the owner
    const activity = await this.activityModel.findById(createScheduleDto.activityId)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity) {
      throw new NotFoundException(`النشاط بالمعرف ${createScheduleDto.activityId} غير موجود`);
    }

    if (activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك إنشاء جدول لنشاط لا تملكه');
    }

    const newSchedule = new this.scheduleModel({
      activity: new Types.ObjectId(createScheduleDto.activityId),
      recurrenceType: createScheduleDto.recurrenceType,
      daysOfWeek: createScheduleDto.daysOfWeek || [],
      startTime: createScheduleDto.startTime,
      endTime: createScheduleDto.endTime,
      startDate: createScheduleDto.startDate,
      endDate: createScheduleDto.endDate,
      maxOccurrences: createScheduleDto.maxOccurrences,
      description: createScheduleDto.description,
    });

    return newSchedule.save();
  }

  async getSchedules(ownerId: string) {
    // Get all activities for entities owned by the user
    const entities = await this.entityModel.find({ owner: ownerId }).exec();
    const entityIds = entities.map(entity => entity._id);

    const activities = await this.activityModel.find({ entity: { $in: entityIds } }).exec();
    const activityIds = activities.map(activity => activity._id);

    return this.scheduleModel.find({ activity: { $in: activityIds } })
      .populate('activity')
      .exec();
  }

  async getScheduleById(id: string, ownerId: string) {
    const schedule = await this.scheduleModel.findById(id)
      .populate('activity')
      .exec();

    if (!schedule) {
      throw new NotFoundException(`الجدول بالمعرف ${id} غير موجود`);
    }

    // Verify that the schedule's activity belongs to an entity owned by the user
    const activity = await this.activityModel.findById(schedule.activity._id)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك الوصول إلى هذا الجدول');
    }

    return schedule;
  }

  async updateSchedule(id: string, updateData: Partial<{
    recurrenceType: string;
    daysOfWeek: string[];
    startTime: Date;
    endTime: Date;
    startDate: Date;
    endDate: Date;
    maxOccurrences: number;
    description: string;
    isActive: boolean;
  }>, ownerId: string) {
    const schedule = await this.scheduleModel.findById(id).exec();
    if (!schedule) {
      throw new NotFoundException(`الجدول بالمعرف ${id} غير موجود`);
    }

    // Verify that the schedule's activity belongs to an entity owned by the user
    const activity = await this.activityModel.findById(schedule.activity._id)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك تعديل هذا الجدول');
    }

    return this.scheduleModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).exec();
  }

  async deleteSchedule(id: string, ownerId: string) {
    const schedule = await this.scheduleModel.findById(id).exec();
    if (!schedule) {
      throw new NotFoundException(`الجدول بالمعرف ${id} غير موجود`);
    }

    // Verify that the schedule's activity belongs to an entity owned by the user
    const activity = await this.activityModel.findById(schedule.activity._id)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك حذف هذا الجدول');
    }

    await this.scheduleModel.findByIdAndDelete(id).exec();
    return { message: 'تم حذف الجدول بنجاح' };
  }

  async getSchedulesForActivity(activityId: string, ownerId: string) {
    // Verify that the activity belongs to an entity owned by the user
    const activity = await this.activityModel.findById(activityId)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك الوصول إلى جداول نشاط لا تملكه');
    }

    return this.scheduleModel.find({ activity: new Types.ObjectId(activityId) })
      .populate('activity')
      .exec();
  }
}