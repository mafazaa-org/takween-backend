import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './message.schema';
import { Activity, ActivityDocument } from '../activity/activity.schema';
import { Entity, EntityDocument } from '../entity/entity.schema';
import { User, UserDocument } from '../user/user.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createMessage(createMessageDto: {
    content: string;
    activityId: string;
    recipients?: string[];
  }, ownerId: string) {
    // Verify activity exists and belongs to an entity owned by the user
    const activity = await this.activityModel.findById(createMessageDto.activityId)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity) {
      throw new NotFoundException(`النشاط بالمعرف ${createMessageDto.activityId} غير موجود`);
    }

    if (activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك إرسال رسالة لنشاط لا تملكه');
    }

    // Verify recipients exist if provided
    if (createMessageDto.recipients && createMessageDto.recipients.length > 0) {
      for (const recipientId of createMessageDto.recipients) {
        const user = await this.userModel.findById(recipientId).exec();
        if (!user) {
          throw new NotFoundException(`المستخدم بالمعرف ${recipientId} غير موجود`);
        }
      }
    }

    const newMessage = new this.messageModel({
      sender: new Types.ObjectId(ownerId),
      activity: new Types.ObjectId(createMessageDto.activityId),
      content: createMessageDto.content,
      recipients: createMessageDto.recipients?.map(id => new Types.ObjectId(id)) || [],
    });

    return newMessage.save();
  }

  async getMessages(ownerId: string, activityId?: string) {
    // Get all activities for entities owned by the user
    const entities = await this.entityModel.find({ owner: ownerId }).exec();
    const entityIds = entities.map(entity => entity._id);

    const activities = await this.activityModel.find({ entity: { $in: entityIds } }).exec();
    const activityIds = activities.map(activity => activity._id);

    const query: any = { activity: { $in: activityIds } };
    if (activityId) {
      query.activity = new Types.ObjectId(activityId);
    }

    // Also include messages where the user is a recipient
    query.$or = [
      { sender: new Types.ObjectId(ownerId) },
      { recipients: { $in: [new Types.ObjectId(ownerId)] } }
    ];

    return this.messageModel.find(query)
      .populate('sender')
      .populate('recipients')
      .populate('activity')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getMessageById(id: string, ownerId: string) {
    const message = await this.messageModel.findById(id)
      .populate('sender')
      .populate('recipients')
      .populate('activity')
      .exec();

    if (!message) {
      throw new NotFoundException(`الرسالة بالمعرف ${id} غير موجودة`);
    }

    // Verify that the user can access this message (either sent it or received it)
    const canAccess = message.sender.toString() === ownerId || 
                     message.recipients.some(r => r.toString() === ownerId);

    if (!canAccess) {
      throw new ForbiddenException('لا يمكنك الوصول إلى هذه الرسالة');
    }

    return message;
  }

  async markAsRead(id: string, userId: string) {
    const message = await this.messageModel.findById(id).exec();
    if (!message) {
      throw new NotFoundException(`الرسالة بالمعرف ${id} غير موجودة`);
    }

    // Add user to read receipts if not already there
    const readReceiptIndex = message.readReceipts.findIndex(
      receipt => receipt.user.toString() === userId
    );

    if (readReceiptIndex === -1) {
      message.readReceipts.push({
        user: new Types.ObjectId(userId),
        readAt: new Date(),
      });
      await message.save();
    }

    return { message: 'تم تعليم الرسالة كمقروءة' };
  }

  async deleteMessage(id: string, ownerId: string) {
    const message = await this.messageModel.findById(id).exec();
    if (!message) {
      throw new NotFoundException(`الرسالة بالمعرف ${id} غير موجودة`);
    }

    // Only allow deletion if the user is the sender
    if (message.sender.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك حذف رسالة لم ترسلها');
    }

    await this.messageModel.findByIdAndDelete(id).exec();
    return { message: 'تم حذف الرسالة بنجاح' };
  }
}