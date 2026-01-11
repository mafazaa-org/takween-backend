import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEntityDto {
  @IsString({ message: 'الاسم يجب أن يكون نص' })
  @IsNotEmpty({ message: 'الاسم مطلوب' })
  name: string;
}
