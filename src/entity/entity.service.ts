import { Injectable } from '@nestjs/common';

@Injectable()
export class EntityService {
  private entities: any[] = [];

  createEntity({ name }: { name: string }) {
    this.entities.push({ id: this.entities.length + 1, name });
    return this.entities[this.entities.length - 1];
  }

  getEntities() {
    return this.entities;
  }

  updateEntity(id: number, { name }: { name: string }) {
    this.entities[id - 1].name = name;
    return this.entities;
  }

  deleteEntity(id: number) {
    this.entities.splice(id - 1, 1);
    return 'Entity  deleted successfully';
  }
}
