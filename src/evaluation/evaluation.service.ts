import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Evaluation, EvaluationDocument } from './evaluation.schema';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { Student, StudentDocument } from '../student/student.schema';
import { Activity, ActivityDocument } from '../activity/activity.schema';
import { Entity, EntityDocument } from '../entity/entity.schema';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectModel(Evaluation.name) private evaluationModel: Model<EvaluationDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
  ) {}

  async createEvaluation(createEvaluationDto: CreateEvaluationDto, ownerId: string) {
    // Verify student exists and belongs to an entity owned by the user
    const student = await this.studentModel.findById(createEvaluationDto.studentId).exec();
    if (!student) {
      throw new NotFoundException(`الطالب بالمعرف ${createEvaluationDto.studentId} غير موجود`);
    }

    // Verify activity exists and belongs to an entity owned by the user
    const activity = await this.activityModel.findById(createEvaluationDto.activityId)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity) {
      throw new NotFoundException(`النشاط بالمعرف ${createEvaluationDto.activityId} غير موجود`);
    }

    if (activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك إضافة تقييم لنشاط لا تملكه');
    }

    const newEvaluation = new this.evaluationModel({
      student: new Types.ObjectId(createEvaluationDto.studentId),
      activity: new Types.ObjectId(createEvaluationDto.activityId),
      score: createEvaluationDto.score,
      feedback: createEvaluationDto.feedback,
    });

    return newEvaluation.save();
  }

  async getEvaluations(ownerId: string, activityId?: string) {
    // Get all activities for entities owned by the user
    const entities = await this.entityModel.find({ owner: ownerId }).exec();
    const entityIds = entities.map(entity => entity._id);

    const activities = await this.activityModel.find({ entity: { $in: entityIds } }).exec();
    const activityIds = activities.map(activity => activity._id);

    const query: any = { activity: { $in: activityIds } };
    if (activityId) {
      query.activity = new Types.ObjectId(activityId);
    }

    return this.evaluationModel.find(query)
      .populate('student')
      .populate('activity')
      .exec();
  }

  async getEvaluationById(id: string, ownerId: string) {
    const evaluation = await this.evaluationModel.findById(id)
      .populate('student')
      .populate('activity')
      .exec();

    if (!evaluation) {
      throw new NotFoundException(`التقييم بالمعرف ${id} غير موجود`);
    }

    // Verify that the evaluation's activity belongs to an entity owned by the user
    const activity = await this.activityModel.findById(evaluation.activity._id)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك الوصول إلى هذا التقييم');
    }

    return evaluation;
  }

  async updateEvaluation(id: string, updateEvaluationDto: UpdateEvaluationDto, ownerId: string) {
    const evaluation = await this.evaluationModel.findById(id).exec();
    if (!evaluation) {
      throw new NotFoundException(`التقييم بالمعرف ${id} غير موجود`);
    }

    // Verify that the evaluation's activity belongs to an entity owned by the user
    const activity = await this.activityModel.findById(evaluation.activity._id)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك تعديل هذا التقييم');
    }

    return this.evaluationModel.findByIdAndUpdate(
      id,
      updateEvaluationDto,
      { new: true }
    ).exec();
  }

  async deleteEvaluation(id: string, ownerId: string) {
    const evaluation = await this.evaluationModel.findById(id).exec();
    if (!evaluation) {
      throw new NotFoundException(`التقييم بالمعرف ${id} غير موجود`);
    }

    // Verify that the evaluation's activity belongs to an entity owned by the user
    const activity = await this.activityModel.findById(evaluation.activity._id)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك حذف هذا التقييم');
    }

    await this.evaluationModel.findByIdAndDelete(id).exec();
    return { message: 'تم حذف التقييم بنجاح' };
  }
}