import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Entity, EntityDocument } from './entity.schema';
import { Admin, AdminDocument } from '../admin/admin.schema';

@Injectable()
export class EntityService {
  constructor(
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async createEntity({ name, owner }: { name: string; owner: string }) {
    const admin = await this.adminModel.findById(owner).exec();
    if (!admin) throw new NotFoundException(`المسؤول بالمعرف ${owner} غير موجود`);
    return new this.entityModel({
      name,
      owner: new Types.ObjectId(owner),
    }).save();
  }

  async getEntities() {
    return this.entityModel.find().exec();
  }

  async updateEntity(id: string, { name }: { name: string }) {
    return this.entityModel
      .findByIdAndUpdate(id, { name }, { new: true })
      .exec();
  }

  async deleteEntity(id: string) {
    await this.entityModel.findByIdAndDelete(id).exec();
    return 'تم حذف الكيان بنجاح';
  }
}
