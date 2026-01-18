import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Entity, EntityDocument } from './entity.schema';
import { User, UserDocument } from 'src/user/user.schema';

@Injectable()
export class EntityService {
  constructor(
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createEntity({ name, owner }: { name: string; owner: string }) {
    const user = await this.userModel.findById(owner).exec();
    if (!user) throw new NotFoundException(`المستخدم بالمعرف ${owner} غير موجود`);
    return new this.entityModel({
      name,
      owner: new Types.ObjectId(owner),
    }).save();
  }

  async getEntities(owner: string) {
    return this.entityModel.find({ owner: new Types.ObjectId(owner) }).exec();
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
