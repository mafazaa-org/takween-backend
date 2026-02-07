import { IsNotEmpty, IsString } from "class-validator";

export class RemoveTeacherFromClassroomDto {
    @IsString({ message: 'معرف المعلم يجب أن يكون نص' })
    @IsNotEmpty({ message: 'معرف المعلم مطلوب' })
    teacher: string;
}