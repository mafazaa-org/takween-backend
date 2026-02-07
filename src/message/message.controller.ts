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
import { MessageService } from './message.service';
import { AuthGuard } from '../token/auth.guard';
import { UserTypeGuard } from '../user/user-type.guard';

@Controller('message')
@UseGuards(AuthGuard, UserTypeGuard("sheikh", "admin", "teacher", "student", "member"))
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  createMessage(
    @Body() createMessageDto: {
      content: string;
      activityId: string;
      recipients?: string[];
    },
    @Request() req: any,
  ) {
    return this.messageService.createMessage(createMessageDto, req.user?.id as string);
  }

  @Get()
  getMessages(
    @Request() req: any,
    @Query('activityId') activityId?: string,
  ) {
    return this.messageService.getMessages(req.user?.id as string, activityId);
  }

  @Get(':id')
  getMessage(@Param('id') id: string, @Request() req: any) {
    return this.messageService.getMessageById(id, req.user?.id as string);
  }

  @Put(':id/read')
  markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.messageService.markAsRead(id, req.user?.id as string);
  }

  @Delete(':id')
  deleteMessage(@Param('id') id: string, @Request() req: any) {
    return this.messageService.deleteMessage(id, req.user?.id as string);
  }
}