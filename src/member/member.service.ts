import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Member, MemberDocument } from './member.schema';
import { User, UserDocument } from '../user/user.schema';
import { Entity, EntityDocument } from '../entity/entity.schema';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<MemberDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
  ) {}

  async createMember(createMemberDto: {
    name: string;
    userId: string;
    entities?: string[];
  }, ownerId: string) {
    // Verify that the user exists and belongs to the owner
    const user = await this.userModel.findById(createMemberDto.userId).exec();
    if (!user) {
      throw new NotFoundException(`المستخدم بالمعرف ${createMemberDto.userId} غير موجود`);
    }

    // Verify that the owner has access to the entities
    if (createMemberDto.entities && createMemberDto.entities.length > 0) {
      for (const entityId of createMemberDto.entities) {
        const entity = await this.entityModel.findById(entityId).exec();
        if (!entity || entity.owner.toString() !== ownerId) {
          throw new ForbiddenException(`لا يمكنك الوصول إلى الكيان بالمعرف ${entityId}`);
        }
      }
    }

    const newMember = new this.memberModel({
      name: createMemberDto.name,
      user: new Types.ObjectId(createMemberDto.userId),
      entities: createMemberDto.entities?.map(id => new Types.ObjectId(id)) || [],
    });

    return newMember.save();
  }

  async getMembers(ownerId: string) {
    // Only return members associated with entities owned by the user
    const entities = await this.entityModel.find({ owner: ownerId }).exec();
    const entityIds = entities.map(entity => entity._id);

    return this.memberModel.find({
      entities: { $in: entityIds }
    }).populate('user').populate('entities').exec();
  }

  async getMemberById(id: string, ownerId: string) {
    const member = await this.memberModel.findById(id)
      .populate('user')
      .populate('entities')
      .exec();

    if (!member) {
      throw new NotFoundException(`العضو بالمعرف ${id} غير موجود`);
    }

    // Check if any of the member's entities belong to the owner
    const entities = await this.entityModel.find({ owner: ownerId }).exec();
    const ownerEntityIds = entities.map(entity => entity._id);
    
    const hasAccess = member.entities.some(entityId => 
      ownerEntityIds.some(ownerEntityId => ownerEntityId.equals(entityId))
    );

    if (!hasAccess) {
      throw new ForbiddenException('لا يمكنك الوصول إلى هذا العضو');
    }

    return member;
  }

  async updateMember(id: string, updateData: Partial<{
    name: string;
    entities: string[];
    isActive: boolean;
  }>, ownerId: string) {
    const member = await this.memberModel.findById(id).exec();
    if (!member) {
      throw new NotFoundException(`العضو بالمعرف ${id} غير موجود`);
    }

    // Check if any of the member's entities belong to the owner
    const entities = await this.entityModel.find({ owner: ownerId }).exec();
    const ownerEntityIds = entities.map(entity => entity._id);
    
    const hasAccess = member.entities.some(entityId => 
      ownerEntityIds.some(ownerEntityId => ownerEntityId.equals(entityId))
    );

    if (!hasAccess) {
      throw new ForbiddenException('لا يمكنك تعديل هذا العضو');
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

    return this.memberModel.findByIdAndUpdate(
      id,
      {
        ...updateData,
        entities: updateData.entities?.map(id => new Types.ObjectId(id)),
      },
      { new: true }
    ).exec();
  }

  async deleteMember(id: string, ownerId: string) {
    const member = await this.memberModel.findById(id).exec();
    if (!member) {
      throw new NotFoundException(`العضو بالمعرف ${id} غير موجود`);
    }

    // Check if any of the member's entities belong to the owner
    const entities = await this.entityModel.find({ owner: ownerId }).exec();
    const ownerEntityIds = entities.map(entity => entity._id);
    
    const hasAccess = member.entities.some(entityId => 
      ownerEntityIds.some(ownerEntityId => ownerEntityId.equals(entityId))
    );

    if (!hasAccess) {
      throw new ForbiddenException('لا يمكنك حذف هذا العضو');
    }

    await this.memberModel.findByIdAndDelete(id).exec();
    return { message: 'تم حذف العضو بنجاح' };
  }
}