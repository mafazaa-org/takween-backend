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
} from '@nestjs/common';
import { MemberService } from './member.service';
import { AuthGuard } from '../token/auth.guard';
import { UserTypeGuard } from '../user/user-type.guard';

@Controller('member')
@UseGuards(AuthGuard, UserTypeGuard("sheikh", "admin"))
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  createMember(
    @Body() createMemberDto: {
      name: string;
      userId: string;
      entities?: string[];
    },
    @Request() req: any,
  ) {
    return this.memberService.createMember(createMemberDto, req.user?.id as string);
  }

  @Get()
  getMembers(@Request() req: any) {
    return this.memberService.getMembers(req.user?.id as string);
  }

  @Get(':id')
  getMember(@Param('id') id: string, @Request() req: any) {
    return this.memberService.getMemberById(id, req.user?.id as string);
  }

  @Put(':id')
  updateMember(
    @Param('id') id: string,
    @Body() updateMemberDto: {
      name?: string;
      entities?: string[];
      isActive?: boolean;
    },
    @Request() req: any,
  ) {
    return this.memberService.updateMember(id, updateMemberDto, req.user?.id as string);
  }

  @Delete(':id')
  deleteMember(@Param('id') id: string, @Request() req: any) {
    return this.memberService.deleteMember(id, req.user?.id as string);
  }
}