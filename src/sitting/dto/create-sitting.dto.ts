import { IsNotEmpty, IsMongoId, IsDateString } from 'class-validator';

export class CreateSittingDto {
    @IsDateString({}, { message: 'التاريخ يجب أن يكون تاريخ صالح' })
    @IsNotEmpty({ message: 'التاريخ مطلوب' })
    date: string;

    @IsMongoId({ message: 'معرف الفصل غير صالح' })
    @IsNotEmpty({ message: 'الفصل مطلوب' })
    classroom: string;
}

