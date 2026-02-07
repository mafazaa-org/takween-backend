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
import { ContentService } from './content.service';
import { AuthGuard } from '../token/auth.guard';
import { UserTypeGuard } from '../user/user-type.guard';

@Controller('content')
@UseGuards(AuthGuard, UserTypeGuard("sheikh", "admin", "teacher"))
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  createContent(
    @Body() createContentDto: {
      title: string;
      description?: string;
      activityId: string;
      fileName: string;
      fileType: string;
      fileUrl: string;
      fileSize?: number;
      contentType?: string;
    },
    @Request() req: any,
  ) {
    return this.contentService.createContent(createContentDto, req.user?.id as string);
  }

  @Get()
  getContent(
    @Request() req: any,
    @Query('activityId') activityId?: string,
  ) {
    return this.contentService.getContent(req.user?.id as string, activityId);
  }

  @Get(':id')
  getContentById(@Param('id') id: string, @Request() req: any) {
    return this.contentService.getContentById(id, req.user?.id as string);
  }

  @Put(':id')
  updateContent(
    @Param('id') id: string,
    @Body() updateContentDto: {
      title?: string;
      description?: string;
      fileName?: string;
      fileType?: string;
      fileUrl?: string;
      fileSize?: number;
      contentType?: string;
    },
    @Request() req: any,
  ) {
    return this.contentService.updateContent(id, updateContentDto, req.user?.id as string);
  }

  @Delete(':id')
  deleteContent(@Param('id') id: string, @Request() req: any) {
    return this.contentService.deleteContent(id, req.user?.id as string);
  }
}