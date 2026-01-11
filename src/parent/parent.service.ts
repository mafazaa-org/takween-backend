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

  async createParent(data: { name: string; email: string; phone?: string; studentIds?: string[] }) {
    const parent = new this.parentModel({
      ...data,
      studentIds: data.studentIds?.map(id => new Types.ObjectId(id)) || [],
    });
    return parent.save();
  }

  async getParents() {
    return this.parentModel.find().populate('studentIds').exec();
  }

  async getParent(id: string) {
    return this.parentModel.findById(id).populate('studentIds').exec();
  }

  async updateParent(id: string, data: { name?: string; email?: string; phone?: string }) {
    return this.parentModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async addStudent(parentId: string, studentId: string) {
    const student = await this.studentModel.findById(studentId).exec();
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return this.parentModel.findByIdAndUpdate(
      parentId,
      { $addToSet: { studentIds: new Types.ObjectId(studentId) } },
      { new: true },
    ).populate('studentIds').exec();
  }

  async removeStudent(parentId: string, studentId: string) {
    return this.parentModel.findByIdAndUpdate(
      parentId,
      { $pull: { studentIds: new Types.ObjectId(studentId) } },
      { new: true },
    ).populate('studentIds').exec();
  }

  async deleteParent(id: string) {
    await this.parentModel.findByIdAndDelete(id).exec();
    return 'Parent deleted successfully';
  }
}
