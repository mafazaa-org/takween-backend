import { IsOptional, IsDateString, IsMongoId } from 'class-validator';

export class UpdateSittingDto {
    @IsOptional()
    @IsDateString({}, { message: 'التاريخ يجب أن يكون تاريخ صالح' })
    date?: string;

    @IsOptional()
    @IsMongoId({ message: 'معرف الفصل غير صالح' })
    classroom?: string;
}

