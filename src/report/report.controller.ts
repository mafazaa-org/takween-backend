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
import { ReportService } from './report.service';
import { AuthGuard } from '../token/auth.guard';
import { UserTypeGuard } from '../user/user-type.guard';
import { GenerateReportDto } from './dto/generate-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Controller('report')
@UseGuards(AuthGuard, UserTypeGuard("sheikh", "admin", "teacher"))
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  generateReport(
    @Body() generateReportDto: GenerateReportDto,
    @Request() req: any,
  ) {
    return this.reportService.generateReport(generateReportDto, req.user?.id as string);
  }

  @Get()
  getReports(@Request() req: any) {
    return this.reportService.getReports(req.user?.id as string);
  }

  @Get(':id')
  getReport(@Param('id') id: string, @Request() req: any) {
    return this.reportService.getReportById(id, req.user?.id as string);
  }

  @Get('entity/:entityId')
  getReportsForEntity(
    @Param('entityId') entityId: string,
    @Request() req: any,
  ) {
    return this.reportService.getReportsForEntity(entityId, req.user?.id as string);
  }

  @Get('activity/:activityId')
  getReportsForActivity(
    @Param('activityId') activityId: string,
    @Request() req: any,
  ) {
    return this.reportService.getReportsForActivity(activityId, req.user?.id as string);
  }

  @Put(':id')
  updateReport(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
    @Request() req: any,
  ) {
    return this.reportService.updateReport(id, updateReportDto, req.user?.id as string);
  }

  @Delete(':id')
  deleteReport(@Param('id') id: string, @Request() req: any) {
    return this.reportService.deleteReport(id, req.user?.id as string);
  }
}