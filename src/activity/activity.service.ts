import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityService {
  private activities: any[] = [];

  createActivity({ name }: { name: string }) {
    this.activities.push({ id: this.activities.length + 1, name });
    return this.activities[this.activities.length - 1];
  }

  getActivities() {
    return this.activities;
  }

  updateActivity(id: number, { name }: { name: string }) {
    this.activities[id - 1].name = name;
    return this.activities;
  }

  deleteActivity(id: number) {
    this.activities.splice(id - 1, 1);
    return 'Activity deleted successfully';
  }
}
