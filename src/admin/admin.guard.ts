import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './admin.schema';
import { Model } from 'mongoose';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const admin = await this.adminModel.findById(request.user.id);
      if (!admin) {
        throw new UnauthorizedException('Admin not found');
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException('Admin not found');
    }
  }
}
