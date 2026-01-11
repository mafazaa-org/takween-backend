import { IsNotEmpty, IsString, IsMongoId, IsOptional } from 'class-validator';

export class CreateEntityDto {
  @IsString({ message: 'الاسم يجب أن يكون نص' })
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  name: string;

  @IsOptional()
  @IsMongoId({ message: 'معرف المسؤول غير صالح' })
  owner?: string;
}
