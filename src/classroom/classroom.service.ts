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

  async createClassroom({ name, activity }: { name: string; activity: string; }) {
    const activityDoc = await this.activityModel.findById(activity).exec();
    if (!activityDoc) throw new NotFoundException(`النشاط بالمعرف ${activity} غير موجود`);
    return new this.classroomModel({ name, activity: new Types.ObjectId(activity) }).save();
  } 

  async getClassrooms(activity?: string) {
    return this.classroomModel.find(activity ? { activity: new Types.ObjectId(activity) } : {}).exec();
  }

    async updateClassroom(id: string, { name }: { name?: string }) {
    const updateData: any = {};
    if (name) updateData.name = name;
    
    return this.classroomModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async deleteClassroom(id: string) {
    await this.classroomModel.findByIdAndDelete(id).exec();
    return 'تم حذف الفصل بنجاح';
  }
}
