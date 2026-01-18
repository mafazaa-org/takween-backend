import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateClassroomDto {
  @IsOptional()
  @IsString({ message: 'الاسم يجب أن يكون نص' })
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  name?: string;
}
