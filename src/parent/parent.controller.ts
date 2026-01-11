import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ParentService } from './parent.service';

@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get()
  getParents() {
    return this.parentService.getParents();
  }

  @Get(':id')
  getParent(@Param('id') id: string) {
    return this.parentService.getParent(id);
  }

  @Post()
  createParent(@Body() body: { name: string; email: string; phone?: string; studentIds?: string[] }) {
    return this.parentService.createParent(body);
  }

  @Put(':id')
  updateParent(@Param('id') id: string, @Body() body: { name?: string; email?: string; phone?: string }) {
    return this.parentService.updateParent(id, body);
  }

  @Post(':parentId/student/:studentId')
  addStudent(@Param('parentId') parentId: string, @Param('studentId') studentId: string) {
    return this.parentService.addStudent(parentId, studentId);
  }

  @Delete(':parentId/student/:studentId')
  removeStudent(@Param('parentId') parentId: string, @Param('studentId') studentId: string) {
    return this.parentService.removeStudent(parentId, studentId);
  }

  @Delete(':id')
  deleteParent(@Param('id') id: string) {
    return this.parentService.deleteParent(id);
  }
}
