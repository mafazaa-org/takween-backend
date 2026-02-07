import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Teacher, TeacherDocument } from './teacher.schema';
import { User, UserDocument } from '../user/user.schema';
import { Entity, EntityDocument } from '../entity/entity.schema';
import { Activity, ActivityDocument } from '../activity/activity.schema';

@Injectable()
export class TeacherService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  async createTeacher(createTeacherDto: {
    name: string;
    userId: string;
    entities?: string[];
    activities?: string[];
    specialization?: string;
  }, ownerId: string) {
    // Verify that the user exists and belongs to the owner
    const user = await this.userModel.findById(createTeacherDto.userId).exec();
    if (!user) {
      throw new NotFoundException(`المستخدم بالمعرف ${createTeacherDto.userId} غير موجود`);
    }

    // Verify that the owner has access to the entities
    if (createTeacherDto.entities && createTeacherDto.entities.length > 0) {
      for (const entityId of createTeacherDto.entities) {
        const entity = await this.entityModel.findById(entityId).exec();
        if (!entity || entity.owner.toString() !== ownerId) {
          throw new ForbiddenException(`لا يمكنك الوصول إلى الكيان بالمعرف ${entityId}`);
        }
      }
    }

    // Verify that the owner has access to the activities
    if (createTeacherDto.activities && createTeacherDto.activities.length > 0) {
      for (const activityId of createTeacherDto.activities) {
        const activity = await this.activityModel.findById(activityId).populate<{ entity: EntityDocument }>('entity').exec();
        if (!activity || activity.entity.owner.toString() !== ownerId) {
          throw new ForbiddenException(`لا يمكنك الوصول إلى النشاط بالمعرف ${activityId}`);
        }
      }
    }

    const newTeacher = new this.teacherModel({
      name: createTeacherDto.name,
      user: new Types.ObjectId(createTeacherDto.userId),
      entities: createTeacherDto.entities?.map(id => new Types.ObjectId(id)) || [],
      activities: createTeacherDto.activities?.map(id => new Types.ObjectId(id)) || [],
      specialization: createTeacherDto.specialization,
    });

    return newTeacher.save();
  }

  async getTeachers(ownerId: string) {
    // Only return teachers associated with entities owned by the user
    const entities = await this.entityModel.find({ owner: ownerId }).exec();
    const entityIds = entities.map(entity => entity._id);

    return this.teacherModel.find({
      entities: { $in: entityIds }
    }).populate('user').populate('entities').populate('activities').exec();
  }

  async getTeacherById(id: string, ownerId: string) {
    const teacher = await this.teacherModel.findById(id)
      .populate('user')
      .populate('entities')
      .populate('activities')
      .exec();

    if (!teacher) {
      throw new NotFoundException(`المعلم بالمعرف ${id} غير موجود`);
    }

    // Check if any of the teacher's entities belong to the owner
    const entities = await this.entityModel.find({ owner: ownerId }).exec();
    const ownerEntityIds = entities.map(entity => entity._id);
    
    const hasAccess = teacher.entities.some(entityId => 
      ownerEntityIds.some(ownerEntityId => ownerEntityId.equals(entityId))
    );

    if (!hasAccess) {
      throw new ForbiddenException('لا يمكنك الوصول إلى هذا المعلم');
    }

    return teacher;
  }

  async updateTeacher(id: string, updateData: Partial<{
    name: string;
    entities: string[];
    activities: string[];
    specialization: string;
    isActive: boolean;
  }>, ownerId: string) {
    const teacher = await this.teacherModel.findById(id).exec();
    if (!teacher) {
      throw new NotFoundException(`المعلم بالمعرف ${id} غير موجود`);
    }

    // Check if any of the teacher's entities belong to the owner
    const entities = await this.entityModel.find({ owner: ownerId }).exec();
    const ownerEntityIds = entities.map(entity => entity._id);
    
    const hasAccess = teacher.entities.some(entityId => 
      ownerEntityIds.some(ownerEntityId => ownerEntityId.equals(entityId))
    );

    if (!hasAccess) {
      throw new ForbiddenException('لا يمكنك تعديل هذا المعلم');
    }

    // Verify entities if provided
    if (updateData.entities) {
      for (const entityId of updateData.entities) {
        const entity = await this.entityModel.findById(entityId).exec();
        if (!entity || entity.owner.toString() !== ownerId) {
          throw new ForbiddenException(`لا يمكنك الوصول إلى الكيان بالمعرف ${entityId}`);
        }
      }
    }

    // Verify activities if provided
    if (updateData.activities) {
      for (const activityId of updateData.activities) {
        const activity = await this.activityModel.findById(activityId).populate<{ entity: EntityDocument }>('entity').exec();
        if (!activity || activity.entity.owner.toString() !== ownerId) {
          throw new ForbiddenException(`لا يمكنك الوصول إلى النشاط بالمعرف ${activityId}`);
        }
      }
    }

    return this.teacherModel.findByIdAndUpdate(
      id,
      {
        ...updateData,
        entities: updateData.entities?.map(id => new Types.ObjectId(id)),
        activities: updateData.activities?.map(id => new Types.ObjectId(id)),
      },
      { new: true }
    ).exec();
  }

  async deleteTeacher(id: string, ownerId: string) {
    const teacher = await this.teacherModel.findById(id).exec();
    if (!teacher) {
      throw new NotFoundException(`المعلم بالمعرف ${id} غير موجود`);
    }

    // Check if any of the teacher's entities belong to the owner
    const entities = await this.entityModel.find({ owner: ownerId }).exec();
    const ownerEntityIds = entities.map(entity => entity._id);
    
    const hasAccess = teacher.entities.some(entityId => 
      ownerEntityIds.some(ownerEntityId => ownerEntityId.equals(entityId))
    );

    if (!hasAccess) {
      throw new ForbiddenException('لا يمكنك حذف هذا المعلم');
    }

    await this.teacherModel.findByIdAndDelete(id).exec();
    return { message: 'تم حذف المعلم بنجاح' };
  }
}