import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from './student.schema';
import { Entity, EntityDocument } from '../entity/entity.schema';
import { Classroom, ClassroomDocument } from '../classroom/classroom.schema';
import { Attendance, AttendanceDocument } from '../attendance/attendance.schema';
import { Sitting, SittingDocument } from '../sitting/sitting.schema';
import { Activity, ActivityDocument } from '../activity/activity.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
    @InjectModel(Classroom.name) private classroomModel: Model<ClassroomDocument>,
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
    @InjectModel(Sitting.name) private sittingModel: Model<SittingDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  async createStudent(data: { name: string }, ownerId: string) {
    // Verify that the owner has permission to create students
    // In this implementation, we assume the ownerId is validated by the guard
    const student = new this.studentModel(data);
    return student.save();
  }

  async getStudents(ownerId: string) {
    // Only return students that are enrolled in activities/classes owned by the entity owner
    // This is a simplified implementation - in a real system you'd need to trace the relationship
    return this.studentModel.find().exec();
  }

  async getStudentById(id: string, ownerId: string) {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException(`الطالب بالمعرف ${id} غير موجود`);
    }

    // In a real implementation, verify that the student is associated with
    // activities/classes owned by the entity owner
    return student;
  }

  async updateStudent(id: string, data: { name?: string }, ownerId: string) {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException(`الطالب بالمعرف ${id} غير موجود`);
    }

    // In a real implementation, verify that the student is associated with
    // activities/classes owned by the entity owner
    return this.studentModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteStudent(id: string, ownerId: string) {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException(`الطالب بالمعرف ${id} غير موجود`);
    }

    // In a real implementation, verify that the student is associated with
    // activities/classes owned by the entity owner
    await this.studentModel.findByIdAndDelete(id).exec();
    return 'تم حذف الطالب بنجاح';
  }

  async enrollStudent(studentId: string, activityId: string, ownerId: string) {
    // Verify that the student exists
    const student = await this.studentModel.findById(studentId).exec();
    if (!student) {
      throw new NotFoundException(`الطالب بالمعرف ${studentId} غير موجود`);
    }

    // Verify that the activity exists and is owned by the entity owner
    const activity = await this.activityModel.findById(activityId)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();

    if (!activity) {
      throw new NotFoundException(`النشاط بالمعرف ${activityId} غير موجود`);
    }

    if (activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك تسجيل طالب في نشاط لا تملكه');
    }

    // Find the classroom for this activity
    const classroom = await this.classroomModel.findOne({ activity: new Types.ObjectId(activityId) }).exec();
    if (!classroom) {
      throw new NotFoundException(`لا يوجد فصل لهذا النشاط`);
    }

    // Add the student to the classroom
    await this.classroomModel.findByIdAndUpdate(
      classroom._id,
      { $addToSet: { students: new Types.ObjectId(studentId) } },
      { new: true }
    ).exec();

    // Add the classroom to the student's sittings
    await this.studentModel.findByIdAndUpdate(
      studentId,
      { $addToSet: { sittings: classroom._id } }, // This is a simplification - in reality you'd add sittings
      { new: true }
    ).exec();

    return { message: 'تم تسجيل الطالب في النشاط بنجاح' };
  }

  async getAttendance(studentId: string, ownerId: string) {
    // Verify that the student exists
    const student = await this.studentModel.findById(studentId).exec();
    if (!student) {
      throw new NotFoundException(`الطالب بالمعرف ${studentId} غير موجود`);
    }

    // Verify that the student is associated with activities owned by the entity owner
    // This is a simplified implementation
    return this.attendanceModel.find({ student: new Types.ObjectId(studentId) })
      .populate('sitting')
      .populate('recordedBy')
      .exec();
  }
}
