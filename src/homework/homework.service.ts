import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Homework, HomeworkDocument } from './homework.schema';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { Activity, ActivityDocument } from '../activity/activity.schema';
import { Entity, EntityDocument } from '../entity/entity.schema';
import { Student, StudentDocument } from '../student/student.schema';

@Injectable()
export class HomeworkService {
  constructor(
    @InjectModel(Homework.name) private homeworkModel: Model<HomeworkDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async createHomework(createHomeworkDto: CreateHomeworkDto, ownerId: string) {
    // Verify activity exists and belongs to an entity owned by the user
    const activity = await this.activityModel.findById(createHomeworkDto.activityId)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity) {
      throw new NotFoundException(`النشاط بالمعرف ${createHomeworkDto.activityId} غير موجود`);
    }

    if (activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك إنشاء واجب لنشاط لا تملكه');
    }

    // Verify students exist if assignedTo is provided
    if (createHomeworkDto.assignedTo && createHomeworkDto.assignedTo.length > 0) {
      for (const studentId of createHomeworkDto.assignedTo) {
        const student = await this.studentModel.findById(studentId).exec();
        if (!student) {
          throw new NotFoundException(`الطالب بالمعرف ${studentId} غير موجود`);
        }
      }
    }

    const newHomework = new this.homeworkModel({
      title: createHomeworkDto.title,
      description: createHomeworkDto.description,
      activity: new Types.ObjectId(createHomeworkDto.activityId),
      dueDate: new Date(createHomeworkDto.dueDate),
      assignedTo: createHomeworkDto.assignedTo?.map(id => new Types.ObjectId(id)) || [],
    });

    return newHomework.save();
  }

  async getHomeworks(ownerId: string, activityId?: string) {
    // Get all activities for entities owned by the user
    const entities = await this.entityModel.find({ owner: ownerId }).exec();
    const entityIds = entities.map(entity => entity._id);

    const activities = await this.activityModel.find({ entity: { $in: entityIds } }).exec();
    const activityIds = activities.map(activity => activity._id);

    const query: any = { activity: { $in: activityIds } };
    if (activityId) {
      query.activity = new Types.ObjectId(activityId);
    }

    return this.homeworkModel.find(query)
      .populate('activity')
      .populate('assignedTo')
      .exec();
  }

  async getHomeworkById(id: string, ownerId: string) {
    const homework = await this.homeworkModel.findById(id)
      .populate('activity')
      .populate('assignedTo')
      .exec();

    if (!homework) {
      throw new NotFoundException(`الواجب بالمعرف ${id} غير موجود`);
    }

    // Verify that the homework's activity belongs to an entity owned by the user
    const activity = await this.activityModel.findById(homework.activity._id)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك الوصول إلى هذا الواجب');
    }

    return homework;
  }

  async updateHomework(id: string, updateHomeworkDto: UpdateHomeworkDto, ownerId: string) {
    const homework = await this.homeworkModel.findById(id).exec();
    if (!homework) {
      throw new NotFoundException(`الواجب بالمعرف ${id} غير موجود`);
    }

    // Verify that the homework's activity belongs to an entity owned by the user
    const activity = await this.activityModel.findById(homework.activity._id)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك تعديل هذا الواجب');
    }

    // Verify students exist if assignedTo is provided
    if (updateHomeworkDto.assignedTo) {
      for (const studentId of updateHomeworkDto.assignedTo) {
        const student = await this.studentModel.findById(studentId).exec();
        if (!student) {
          throw new NotFoundException(`الطالب بالمعرف ${studentId} غير موجود`);
        }
      }
    }

    const updateData: any = { ...updateHomeworkDto };
    if (updateHomeworkDto.dueDate) {
      updateData.dueDate = new Date(updateHomeworkDto.dueDate);
    }
    if (updateHomeworkDto.assignedTo) {
      updateData.assignedTo = updateHomeworkDto.assignedTo.map(id => new Types.ObjectId(id));
    }

    return this.homeworkModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).exec();
  }

  async deleteHomework(id: string, ownerId: string) {
    const homework = await this.homeworkModel.findById(id).exec();
    if (!homework) {
      throw new NotFoundException(`الواجب بالمعرف ${id} غير موجود`);
    }

    // Verify that the homework's activity belongs to an entity owned by the user
    const activity = await this.activityModel.findById(homework.activity._id)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك حذف هذا الواجب');
    }

    await this.homeworkModel.findByIdAndDelete(id).exec();
    return { message: 'تم حذف الواجب بنجاح' };
  }
}