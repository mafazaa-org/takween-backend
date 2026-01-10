import { Injectable } from '@nestjs/common';

@Injectable()
export class ClassroomService {
  private classrooms: any[] = [];

  createClassroom({ name }: { name: string }) {
    this.classrooms.push({ id: this.classrooms.length + 1, name });
    return this.classrooms[this.classrooms.length - 1];
  }

  getClassrooms() {
    return this.classrooms;
  }

  updateClassroom(id: number, { name }: { name: string }) {
    this.classrooms[id - 1].name = name;
    return this.classrooms;
  }

  deleteClassroom(id: number) {
    this.classrooms.splice(id - 1, 1);
    return 'Classroom deleted successfully';
  }
}
