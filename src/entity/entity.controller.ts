import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { EntityService } from './entity.service';

@Controller('entity')
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  @Get()
  getEntities() {
    return this.entityService.getEntities();
  }

  @Post()
  createEntity(@Body() body: { name: string }) {
    return this.entityService.createEntity({ name: body.name });
  }

  @Put(':id')
  updateEntity(@Param('id') id: string, @Body() body: { name: string }) {
    return this.entityService.updateEntity(Number(id), { name: body.name });
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.entityService.deleteEntity(Number(id));
  }
}
