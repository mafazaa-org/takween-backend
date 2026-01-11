import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EntityService } from './entity.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
import { AuthGuard } from 'src/token/auth.guard';
import { AdminGuard } from 'src/admin/admin.guard';

@Controller('entity')
@UseGuards(AuthGuard, AdminGuard)
export class EntityController {
  constructor(private readonly entityService: EntityService) {}

  @Get()
  getEntities() {
    return this.entityService.getEntities();
  }

  @Post()
  createEntity(@Body() createEntityDto: CreateEntityDto) {
    return this.entityService.createEntity({
      name: createEntityDto.name,
    });
  }

  @Put(':id')
  updateEntity(
    @Param('id') id: string,
    @Body() updateEntityDto: UpdateEntityDto,
  ) {
    return this.entityService.updateEntity(id, { name: updateEntityDto.name });
  }

  @Delete(':id')
  deleteEntity(@Param('id') id: string) {
    return this.entityService.deleteEntity(id);
  }
}
