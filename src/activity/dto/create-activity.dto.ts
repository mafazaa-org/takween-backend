import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreateActivityDto {
  @IsString({ message: 'الاسم يجب أن يكون نص' })
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  name: string;

  @IsMongoId({ message: 'معرف الكيان غير صالح' })
  @IsNotEmpty({ message: 'الكيان مطلوب' })
  entity: string;

  @IsOptional()
  @IsObject({ message: 'الحقول المخصصة يجب أن تكون كائن' })
  customFields?: Record<string, any>;
}
