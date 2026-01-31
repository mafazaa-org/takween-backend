import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student, StudentDocument } from './student.schema';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async createStudent(data: { name: string }) {
    const student = new this.studentModel(data);
    return student.save();
  }

  async getStudents() {
    return this.studentModel.find().exec();
  }

  async getStudent(id: string) {
    return this.studentModel.findById(id).exec();
  }

  async updateStudent(id: string, data: { name?: string }) {
    return this.studentModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async deleteStudent(id: string) {
    await this.studentModel.findByIdAndDelete(id).exec();
    return 'Student deleted successfully';
  }
}
