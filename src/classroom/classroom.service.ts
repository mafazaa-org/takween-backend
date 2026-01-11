import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Classroom, ClassroomDocument } from './classroom.schema';
import { Activity, ActivityDocument } from '../activity/activity.schema';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectModel(Classroom.name)
    private classroomModel: Model<ClassroomDocument>,
    @InjectModel(Activity.name)
    private activityModel: Model<ActivityDocument>,
  ) {}

  async createClassroom({ name, activityId, customFields }: { name: string; activityId: string; customFields?: Record<string, any> }) {
    const activity = await this.activityModel.findById(activityId).exec();
    if (!activity) {
      throw new NotFoundException(`Activity with ID ${activityId} not found`);
    }

    const classroom = new this.classroomModel({
      name,
      activityId: new Types.ObjectId(activityId),
      customFields: customFields || {},
    });
    return classroom.save();
  }

  async getClassrooms(activityId?: string) {
    const query = activityId ? { activityId: new Types.ObjectId(activityId) } : {};
    return this.classroomModel.find(query).exec();
  }

  async updateClassroom(id: string, { name, customFields }: { name?: string; customFields?: Record<string, any> }) {
    const updateData: any = {};
    if (name) updateData.name = name;
    if (customFields) updateData.customFields = customFields;
    
    return this.classroomModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async deleteClassroom(id: string) {
    await this.classroomModel.findByIdAndDelete(id).exec();
    return 'Classroom deleted successfully';
  }
}
