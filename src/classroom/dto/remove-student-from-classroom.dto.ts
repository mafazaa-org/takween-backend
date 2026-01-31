import { IsNotEmpty, IsString } from "class-validator";

export class RemoveStudentFromClassroomDto {
    @IsString({ message: 'معرف الطالب يجب أن يكون نص' })
    @IsNotEmpty({ message: 'معرف الطالب مطلوب' })
    student: string;
}