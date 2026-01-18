import { IsNotEmpty, IsString, IsMongoId, IsOptional, IsObject } from 'class-validator';

export class CreateClassroomDto {
  @IsString({ message: 'الاسم يجب أن يكون نص' })
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  name: string;

  @IsMongoId({ message: 'معرف النشاط غير صالح' })
  @IsNotEmpty({ message: 'النشاط مطلوب' })
  activity: string;
}

