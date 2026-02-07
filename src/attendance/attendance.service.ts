import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Attendance, AttendanceDocument } from './attendance.schema';
import { Student, StudentDocument } from '../student/student.schema';
import { Sitting, SittingDocument } from '../sitting/sitting.schema';
import { User, UserDocument } from '../user/user.schema';
import { Entity, EntityDocument } from '../entity/entity.schema';
import { Activity, ActivityDocument } from '../activity/activity.schema';
import { Classroom, ClassroomDocument } from '../classroom/classroom.schema';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Sitting.name) private sittingModel: Model<SittingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(Classroom.name) private classroomModel: Model<ClassroomDocument>,
  ) {}

  async recordAttendance(recordAttendanceDto: {
    studentId: string;
    sittingId: string;
    present: boolean;
    notes?: string;
  }, ownerId: string) {
    // Verify that the student exists and belongs to an entity owned by the owner
    const student = await this.studentModel.findById(recordAttendanceDto.studentId).exec();
    if (!student) {
      throw new NotFoundException(`الطالب بالمعرف ${recordAttendanceDto.studentId} غير موجود`);
    }

    // Verify that the sitting exists
    const sitting = await this.sittingModel.findById(recordAttendanceDto.sittingId)
      .populate<{ classroom: ClassroomDocument }>('classroom')
      .exec();
      
    if (!sitting) {
      throw new NotFoundException(`الجلسة بالمعرف ${recordAttendanceDto.sittingId} غير موجودة`);
    }

    // Get the activity from the classroom to verify ownership
    const classroom = await this.classroomModel.findById(sitting.classroom._id)
      .populate<{ activity: ActivityDocument }>('activity')
      .exec();
      
    if (!classroom || !classroom.activity) {
      throw new NotFoundException(`الفصل المرتبط بالجلسة غير موجود أو لا يحتوي على نشاط`);
    }

    const activity = await this.activityModel.findById(classroom.activity._id)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك تسجيل الحضور لجلسة في نشاط لا تملكه');
    }

    // Verify that the student is registered in the activity/classroom
    if (!classroom.students.some(studentId => studentId.equals(new Types.ObjectId(recordAttendanceDto.studentId)))) {
      throw new ForbiddenException('لا يمكن تسجيل الحضور لطالب غير مسجل في هذا الفصل');
    }

    // Verify the date/time constraints
    const sittingDate = new Date(sitting.date);
    const currentDate = new Date();
    
    // Don't allow recording attendance for future dates
    if (sittingDate > currentDate) {
      throw new BadRequestException('لا يمكن تسجيل الحضور لجلسة في المستقبل');
    }
    
    // Check if student is already recorded for this sitting
    const existingAttendance = await this.attendanceModel.findOne({
      student: new Types.ObjectId(recordAttendanceDto.studentId),
      sitting: new Types.ObjectId(recordAttendanceDto.sittingId),
    }).exec();

    if (existingAttendance) {
      // Update existing attendance
      return this.attendanceModel.findByIdAndUpdate(
        existingAttendance._id,
        {
          present: recordAttendanceDto.present,
          notes: recordAttendanceDto.notes,
          recordedBy: new Types.ObjectId(ownerId),
          recordedAt: new Date(),
        },
        { new: true }
      ).exec();
    } else {
      // Create new attendance record
      const newAttendance = new this.attendanceModel({
        student: new Types.ObjectId(recordAttendanceDto.studentId),
        sitting: new Types.ObjectId(recordAttendanceDto.sittingId),
        present: recordAttendanceDto.present,
        notes: recordAttendanceDto.notes,
        recordedBy: new Types.ObjectId(ownerId),
      });

      return newAttendance.save();
    }
  }

  async getAttendanceForSitting(sittingId: string, ownerId: string) {
    // Verify that the sitting belongs to an activity owned by the owner
    const sitting = await this.sittingModel.findById(sittingId)
      .populate<{ classroom: ClassroomDocument }>('classroom')
      .exec();
      
    if (!sitting) {
      throw new NotFoundException(`الجلسة بالمعرف ${sittingId} غير موجودة`);
    }

    const classroom = await this.classroomModel.findById(sitting.classroom._id)
      .populate<{ activity: ActivityDocument }>('activity')
      .exec();
      
    if (!classroom || !classroom.activity) {
      throw new NotFoundException(`الفصل المرتبط بالجلسة غير موجود أو لا يحتوي على نشاط`);
    }

    const activity = await this.activityModel.findById(classroom.activity._id)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك الوصول إلى حضور جلسة في نشاط لا تملكه');
    }

    return this.attendanceModel.find({ sitting: new Types.ObjectId(sittingId) })
      .populate('student')
      .populate('recordedBy')
      .exec();
  }

  async getAttendanceForStudent(studentId: string, ownerId: string) {
    // Verify that the student belongs to an entity owned by the owner
    const student = await this.studentModel.findById(studentId).exec();
    if (!student) {
      throw new NotFoundException(`الطالب بالمعرف ${studentId} غير موجود`);
    }

    // Check if the student is associated with any sittings in activities owned by the owner
    // This is a simplified check - in a real implementation you'd need to trace the relationships
    const sittings = await this.sittingModel.find()
      .populate<{ classroom: ClassroomDocument }>('classroom')
      .exec();
      
    const validSittings: Types.ObjectId[] = [];
    for (const sitting of sittings) {
      const classroom = await this.classroomModel.findById(sitting.classroom._id)
        .populate<{ activity: ActivityDocument }>('activity')
        .exec();
        
      if (classroom && classroom.activity) {
        const activity = await this.activityModel.findById(classroom.activity._id)
          .populate<{ entity: EntityDocument }>('entity')
          .exec();
          
        if (activity && activity.entity.owner.toString() === ownerId) {
          validSittings.push(sitting._id);
        }
      }
    }

    return this.attendanceModel.find({ 
      student: new Types.ObjectId(studentId),
      sitting: { $in: validSittings }
    })
      .populate('sitting')
      .populate('recordedBy')
      .exec();
  }

  async getAttendanceForActivity(activityId: string, ownerId: string) {
    // Verify that the activity is owned by the owner
    const activity = await this.activityModel.findById(activityId)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك الوصول إلى حضور نشاط لا تملكه');
    }

    // Get all sittings for classes in this activity
    const classrooms = await this.classroomModel.find({ activity: new Types.ObjectId(activityId) }).exec();
    const classroomIds = classrooms.map(cls => cls._id);
    
    const sittings = await this.sittingModel.find({ classroom: { $in: classroomIds } }).exec();
    const sittingIds = sittings.map(s => s._id);

    return this.attendanceModel.find({ sitting: { $in: sittingIds } })
      .populate('student')
      .populate('sitting')
      .populate('recordedBy')
      .exec();
  }

  async updateAttendance(id: string, updateData: Partial<{
    present: boolean;
    notes: string;
  }>, ownerId: string) {
    const attendance = await this.attendanceModel.findById(id)
      .populate<{ sitting: SittingDocument }>('sitting')
      .exec();
      
    if (!attendance) {
      throw new NotFoundException(`تسجيل الحضور بالمعرف ${id} غير موجود`);
    }

    // Verify ownership of the sitting's activity
    const sitting = await this.sittingModel.findById(attendance.sitting._id)
      .populate<{ classroom: ClassroomDocument }>('classroom')
      .exec();
      
    if (!sitting) {
      throw new NotFoundException(`الجلسة المرتبطة غير موجودة`);
    }

    const classroom = await this.classroomModel.findById(sitting.classroom._id)
      .populate<{ activity: ActivityDocument }>('activity')
      .exec();
      
    if (!classroom || !classroom.activity) {
      throw new NotFoundException(`الفصل المرتبط بالجلسة غير موجود أو لا يحتوي على نشاط`);
    }

    const activity = await this.activityModel.findById(classroom.activity._id)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك تعديل حضور لجلسة في نشاط لا تملكه');
    }

    return this.attendanceModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async deleteAttendance(id: string, ownerId: string) {
    const attendance = await this.attendanceModel.findById(id)
      .populate<{ sitting: SittingDocument }>('sitting')
      .exec();
      
    if (!attendance) {
      throw new NotFoundException(`تسجيل الحضور بالمعرف ${id} غير موجود`);
    }

    // Verify ownership of the sitting's activity
    const sitting = await this.sittingModel.findById(attendance.sitting._id)
      .populate<{ classroom: ClassroomDocument }>('classroom')
      .exec();
      
    if (!sitting) {
      throw new NotFoundException(`الجلسة المرتبطة غير موجودة`);
    }

    const classroom = await this.classroomModel.findById(sitting.classroom._id)
      .populate<{ activity: ActivityDocument }>('activity')
      .exec();
      
    if (!classroom || !classroom.activity) {
      throw new NotFoundException(`الفصل المرتبط بالجلسة غير موجود أو لا يحتوي على نشاط`);
    }

    const activity = await this.activityModel.findById(classroom.activity._id)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك حذف حضور لجلسة في نشاط لا تملكه');
    }

    await this.attendanceModel.findByIdAndDelete(id).exec();
    return { message: 'تم حذف تسجيل الحضور بنجاح' };
  }
}