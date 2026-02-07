import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Report, ReportDocument } from './report.schema';
import { Activity, ActivityDocument } from '../activity/activity.schema';
import { Entity, EntityDocument } from '../entity/entity.schema';
import { User, UserDocument } from '../user/user.schema';
import { Attendance, AttendanceDocument } from '../attendance/attendance.schema';
import { Student, StudentDocument } from '../student/student.schema';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
    @InjectModel(Entity.name) private entityModel: Model<EntityDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Attendance.name) private attendanceModel: Model<AttendanceDocument>,
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

  async generateReport(generateReportDto: {
    type: string;
    entityId: string;
    activityId?: string;
    startDate: Date;
    endDate: Date;
    period?: string;
  }, ownerId: string) {
    // Verify that the entity exists and is owned by the user
    const entity = await this.entityModel.findById(generateReportDto.entityId).exec();
    if (!entity || entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك إنشاء تقرير لكيان لا تملكه');
    }

    // Verify that the activity exists and belongs to the entity (if provided)
    if (generateReportDto.activityId) {
      const activity = await this.activityModel.findById(generateReportDto.activityId).exec();
      if (!activity || activity.entity.toString() !== generateReportDto.entityId) {
        throw new ForbiddenException('لا يمكنك إنشاء تقرير لنشاط لا ينتمي إلى الكيان الخاص بك');
      }
    }

    // Generate report data based on type
    let reportData: Record<string, any> = {};
    
    switch (generateReportDto.type) {
      case 'attendance':
        reportData = await this.generateAttendanceReport(
          generateReportDto.entityId,
          generateReportDto.activityId,
          generateReportDto.startDate,
          generateReportDto.endDate
        );
        break;
      case 'performance':
        reportData = await this.generatePerformanceReport(
          generateReportDto.entityId,
          generateReportDto.activityId,
          generateReportDto.startDate,
          generateReportDto.endDate
        );
        break;
      case 'enrollment':
        reportData = await this.generateEnrollmentReport(
          generateReportDto.entityId,
          generateReportDto.activityId
        );
        break;
      case 'activity':
        reportData = await this.generateActivityReport(
          generateReportDto.entityId,
          generateReportDto.activityId,
          generateReportDto.startDate,
          generateReportDto.endDate
        );
        break;
      default:
        throw new NotFoundException(`نوع التقرير ${generateReportDto.type} غير مدعوم`);
    }

    const newReport = new this.reportModel({
      type: generateReportDto.type,
      entity: new Types.ObjectId(generateReportDto.entityId),
      activity: generateReportDto.activityId ? new Types.ObjectId(generateReportDto.activityId) : undefined,
      generatedBy: new Types.ObjectId(ownerId),
      startDate: generateReportDto.startDate,
      endDate: generateReportDto.endDate,
      data: reportData,
      period: generateReportDto.period || 'custom',
    });

    return newReport.save();
  }

  private async generateAttendanceReport(
    entityId: string,
    activityId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Record<string, any>> {
    // Build query for attendance records
    let attendanceQuery: any = {};
    
    // Get all activities in the entity
    const activitiesFilter = { entity: new Types.ObjectId(entityId) };
    if (activityId) {
      activitiesFilter['_id'] = new Types.ObjectId(activityId);
    }
    
    const activities = await this.activityModel.find(activitiesFilter).exec();
    const activityIds = activities.map(a => a._id);
    
    // Note: In a real implementation, we'd need to properly link
    // students to activities through classrooms and sittings
    
    // This is a simplified implementation - in a real system, we'd need to properly link
    // students to activities through classrooms and sittings
    const attendanceQueryWithDates: any = {};
    if (startDate) {
      attendanceQueryWithDates.createdAt = { $gte: startDate };
    }
    if (endDate) {
      attendanceQueryWithDates.createdAt = attendanceQueryWithDates.createdAt || {};
      attendanceQueryWithDates.createdAt.$lte = endDate;
    }
    
    const attendanceRecords = await this.attendanceModel.find(attendanceQueryWithDates)
      .populate('student')
      .populate('sitting')
      .exec();

    // Calculate attendance statistics
    const stats = {
      totalAttendances: attendanceRecords.length,
      presentCount: attendanceRecords.filter(att => att.present).length,
      absentCount: attendanceRecords.filter(att => !att.present).length,
      attendanceRate: attendanceRecords.length > 0 
        ? (attendanceRecords.filter(att => att.present).length / attendanceRecords.length) * 100 
        : 0,
      records: attendanceRecords.map(att => ({
        studentId: att.student?._id.toString() || 'Unknown',
        date: att._id.getTimestamp ? att._id.getTimestamp().toISOString() : new Date().toISOString(),
        present: att.present,
        notes: att.notes,
      })),
    };

    return stats;
  }

  private async generatePerformanceReport(
    entityId: string,
    activityId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Record<string, any>> {
    // This would contain performance metrics
    // Simplified implementation
    return {
      message: 'Performance report data would go here',
      entityId,
      activityId,
      period: `${startDate} to ${endDate}`,
    };
  }

  private async generateEnrollmentReport(
    entityId: string,
    activityId?: string
  ): Promise<Record<string, any>> {
    // This would contain enrollment statistics
    // Simplified implementation
    return {
      message: 'Enrollment report data would go here',
      entityId,
      activityId,
    };
  }

  private async generateActivityReport(
    entityId: string,
    activityId?: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Record<string, any>> {
    // This would contain activity-specific statistics
    // Simplified implementation
    return {
      message: 'Activity report data would go here',
      entityId,
      activityId,
      period: `${startDate} to ${endDate}`,
    };
  }

  async getReports(ownerId: string) {
    // Get all entities owned by the user
    const entities = await this.entityModel.find({ owner: ownerId }).exec();
    const entityIds = entities.map(entity => entity._id);

    return this.reportModel.find({ entity: { $in: entityIds } })
      .populate('entity')
      .populate('activity')
      .populate('generatedBy')
      .exec();
  }

  async getReportById(id: string, ownerId: string) {
    const report = await this.reportModel.findById(id)
      .populate('entity')
      .populate('activity')
      .populate('generatedBy')
      .exec();

    if (!report) {
      throw new NotFoundException(`التقرير بالمعرف ${id} غير موجود`);
    }

    // Verify that the report's entity is owned by the user
    const entity = await this.entityModel.findById(report.entity._id).exec();
    if (!entity || entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك الوصول إلى هذا التقرير');
    }

    return report;
  }

  async updateReport(id: string, updateData: Partial<{
    data: Record<string, any>;
    isArchived: boolean;
  }>, ownerId: string) {
    const report = await this.reportModel.findById(id).exec();
    if (!report) {
      throw new NotFoundException(`التقرير بالمعرف ${id} غير موجود`);
    }

    // Verify that the report's entity is owned by the user
    const entity = await this.entityModel.findById(report.entity._id).exec();
    if (!entity || entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك تعديل هذا التقرير');
    }

    return this.reportModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).exec();
  }

  async deleteReport(id: string, ownerId: string) {
    const report = await this.reportModel.findById(id).exec();
    if (!report) {
      throw new NotFoundException(`التقرير بالمعرف ${id} غير موجود`);
    }

    // Verify that the report's entity is owned by the user
    const entity = await this.entityModel.findById(report.entity._id).exec();
    if (!entity || entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك حذف هذا التقرير');
    }

    await this.reportModel.findByIdAndDelete(id).exec();
    return { message: 'تم حذف التقرير بنجاح' };
  }

  async getReportsForEntity(entityId: string, ownerId: string) {
    // Verify that the entity is owned by the user
    const entity = await this.entityModel.findById(entityId).exec();
    if (!entity || entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك الوصول إلى تقارير كيان لا تملكه');
    }

    return this.reportModel.find({ entity: new Types.ObjectId(entityId) })
      .populate('activity')
      .populate('generatedBy')
      .exec();
  }

  async getReportsForActivity(activityId: string, ownerId: string) {
    // Verify that the activity belongs to an entity owned by the user
    const activity = await this.activityModel.findById(activityId)
      .populate<{ entity: EntityDocument }>('entity')
      .exec();
      
    if (!activity || activity.entity.owner.toString() !== ownerId) {
      throw new ForbiddenException('لا يمكنك الوصول إلى تقارير نشاط لا تملكه');
    }

    return this.reportModel.find({ activity: new Types.ObjectId(activityId) })
      .populate('entity')
      .populate('generatedBy')
      .exec();
  }
}