import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AuthGuard } from '../token/auth.guard';
import { UserTypeGuard } from '../user/user-type.guard';
import { RecordAttendanceDto } from './dto/record-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendance')
@UseGuards(AuthGuard, UserTypeGuard("sheikh", "admin", "teacher"))
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  recordAttendance(
    @Body() recordAttendanceDto: RecordAttendanceDto,
    @Request() req: any,
  ) {
    return this.attendanceService.recordAttendance(recordAttendanceDto, req.user?.id as string);
  }

  @Get('sitting/:sittingId')
  getAttendanceForSitting(
    @Param('sittingId') sittingId: string,
    @Request() req: any,
  ) {
    return this.attendanceService.getAttendanceForSitting(sittingId, req.user?.id as string);
  }

  @Get('student/:studentId')
  getAttendanceForStudent(
    @Param('studentId') studentId: string,
    @Request() req: any,
  ) {
    return this.attendanceService.getAttendanceForStudent(studentId, req.user?.id as string);
  }

  @Get('activity/:activityId')
  getAttendanceForActivity(
    @Param('activityId') activityId: string,
    @Request() req: any,
  ) {
    return this.attendanceService.getAttendanceForActivity(activityId, req.user?.id as string);
  }

  @Get()
  getAllAttendance(@Request() req: any) {
    // This would return all attendance records for entities owned by the user
    // Implementation depends on specific requirements
    return { message: 'Endpoint for getting all attendance records' };
  }

  @Put(':id')
  updateAttendance(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
    @Request() req: any,
  ) {
    return this.attendanceService.updateAttendance(id, updateAttendanceDto, req.user?.id as string);
  }

  @Delete(':id')
  deleteAttendance(@Param('id') id: string, @Request() req: any) {
    return this.attendanceService.deleteAttendance(id, req.user?.id as string);
  }
}