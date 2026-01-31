import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Sitting, SittingDocument } from './sitting.schema';
import { Classroom, ClassroomDocument } from 'src/classroom/classroom.schema';
import { CreateSittingDto } from './dto/create-sitting.dto';
import { UpdateSittingDto } from './dto/update-sitting.dto';

@Injectable()
export class SittingService {
    constructor(
        @InjectModel(Sitting.name)
        private sittingModel: Model<SittingDocument>,
        @InjectModel(Classroom.name)
        private classroomModel: Model<ClassroomDocument>,
    ) { }

    async createSitting(createSittingDto: CreateSittingDto) {
        const classroom = await this.classroomModel
            .findById(createSittingDto.classroom)
            .exec();
        if (!classroom) {
            throw new NotFoundException(`الفصل بالمعرف ${createSittingDto.classroom} غير موجود`);
        }

        const sitting = new this.sittingModel({
            date: new Date(createSittingDto.date),
            classroom: new Types.ObjectId(createSittingDto.classroom),
        });

        return sitting.save();
    }

    async getSittings(classroom?: string) {
        const filter = classroom ? { classroom: new Types.ObjectId(classroom) } : {};
        return this.sittingModel.find(filter).populate('classroom').exec();
    }

    async getSitting(id: string) {
        return this.sittingModel.findById(id).populate('classroom').exec();
    }

    async updateSitting(id: string, updateSittingDto: UpdateSittingDto) {
        const updateData: any = {};

        if (updateSittingDto.date) {
            updateData.date = new Date(updateSittingDto.date);
        }

        if (updateSittingDto.classroom) {
            const classroom = await this.classroomModel
                .findById(updateSittingDto.classroom)
                .exec();
            if (!classroom) {
                throw new NotFoundException(`الفصل بالمعرف ${updateSittingDto.classroom} غير موجود`);
            }
            updateData.classroom = new Types.ObjectId(updateSittingDto.classroom);
        }

        return this.sittingModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .populate('classroom')
            .exec();
    }

    async deleteSitting(id: string) {
        await this.sittingModel.findByIdAndDelete(id).exec();
        return 'تم حذف الجلسة بنجاح';
    }
}
