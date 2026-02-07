import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AddStudentToClassroomDto {
    @IsOptional()
    @IsString({ message: 'معرف الطالب يجب أن يكون نص' })
    @IsNotEmpty({ message: 'معرف الطالب مطلوب' })
    student: string;
}
