import { IsNotEmpty, IsString } from "class-validator";

class AddTeacherToClassroomDto {
    @IsString({ message: 'معرف المعلم يجب أن يكون نص' })
    @IsNotEmpty({ message: 'معرف المعلم مطلوب' })
    teacher: string;
}

export default AddTeacherToClassroomDto;