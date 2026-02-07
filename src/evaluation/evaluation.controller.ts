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
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { AuthGuard } from '../token/auth.guard';
import { UserTypeGuard } from '../user/user-type.guard';

@Controller('evaluation')
@UseGuards(AuthGuard, UserTypeGuard("sheikh", "admin", "teacher"))
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  createEvaluation(
    @Body() createEvaluationDto: CreateEvaluationDto,
    @Request() req: any,
  ) {
    return this.evaluationService.createEvaluation(createEvaluationDto, req.user?.id as string);
  }

  @Get()
  getEvaluations(
    @Request() req: any,
    @Query('activityId') activityId?: string,
  ) {
    return this.evaluationService.getEvaluations(req.user?.id as string, activityId);
  }

  @Get(':id')
  getEvaluation(@Param('id') id: string, @Request() req: any) {
    return this.evaluationService.getEvaluationById(id, req.user?.id as string);
  }

  @Put(':id')
  updateEvaluation(
    @Param('id') id: string,
    @Body() updateEvaluationDto: UpdateEvaluationDto,
    @Request() req: any,
  ) {
    return this.evaluationService.updateEvaluation(id, updateEvaluationDto, req.user?.id as string);
  }

  @Delete(':id')
  deleteEvaluation(@Param('id') id: string, @Request() req: any) {
    return this.evaluationService.deleteEvaluation(id, req.user?.id as string);
  }
}