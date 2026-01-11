import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Entity, EntityDocument } from './entity.schema';

@Injectable()
export class EntityService {
  constructor(
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
  ) {}

  async createEntity({ name }: { name: string }) {
    const entity = new this.entityModel({
      name,
    });
    return entity.save();
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
    return 'Entity deleted successfully';
  }
}
