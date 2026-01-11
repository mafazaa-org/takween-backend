import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Parent, ParentDocument } from './parent.schema';
import { Student, StudentDocument } from '../student/student.schema';

@Injectable()
export class ParentService {
  constructor(
    @InjectModel(Parent.name) private parentModel: Model<ParentDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async createParent(data: { name: string; email: string; phone?: string; students?: string[] }) {
    if (data.students?.length) {
      const students = await this.studentModel.find({ _id: { $in: data.students } }).exec();
      if (students.length !== data.students.length) throw new NotFoundException('بعض الطلاب غير موجودين');
    }
    return new this.parentModel({ ...data, students: data.students?.map(id => new Types.ObjectId(id)) || [] }).save();
  }

  async getParents() {
    return this.parentModel.find().populate('students').exec();
  }

  async getParent(id: string) {
    return this.parentModel.findById(id).populate('students').exec();
  }

  async updateParent(id: string, data: { name?: string; email?: string; phone?: string }) {
    return this.parentModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async addStudent(parentId: string, studentId: string) {
    const student = await this.studentModel.findById(studentId).exec();
    if (!student) throw new NotFoundException(`الطالب بالمعرف ${studentId} غير موجود`);
    return this.parentModel.findByIdAndUpdate(parentId, { $addToSet: { students: new Types.ObjectId(studentId) } }, { new: true }).populate('students').exec();
  }

  async removeStudent(parentId: string, studentId: string) {
    return this.parentModel.findByIdAndUpdate(parentId, { $pull: { students: new Types.ObjectId(studentId) } }, { new: true }).populate('students').exec();
  }

  async deleteParent(id: string) {
    await this.parentModel.findByIdAndDelete(id).exec();
    return 'تم حذف ولي الأمر بنجاح';
  }
}
