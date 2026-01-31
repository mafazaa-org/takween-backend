import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
} from '@nestjs/common';
import { SittingService } from './sitting.service';
import { CreateSittingDto } from './dto/create-sitting.dto';
import { UpdateSittingDto } from './dto/update-sitting.dto';

@Controller('sitting')
export class SittingController {
    constructor(private readonly sittingService: SittingService) { }

    @Get()
    getSittings(@Query('classroom') classroom?: string) {
        return this.sittingService.getSittings(classroom);
    }

    @Get(':id')
    getSitting(@Param('id') id: string) {
        return this.sittingService.getSitting(id);
    }

    @Post()
    createSitting(@Body() createSittingDto: CreateSittingDto) {
        return this.sittingService.createSitting(createSittingDto);
    }

    @Put(':id')
    updateSitting(
        @Param('id') id: string,
        @Body() updateSittingDto: UpdateSittingDto,
    ) {
        return this.sittingService.updateSitting(id, updateSittingDto);
    }

    @Delete(':id')
    deleteSitting(@Param('id') id: string) {
        return this.sittingService.deleteSitting(id);
    }
}
