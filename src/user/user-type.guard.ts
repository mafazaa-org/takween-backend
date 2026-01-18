import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
    Type,
    mixin,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

export const UserTypeGuard = (...types: ('admin' | 'teacher' | 'parent')[]): Type<CanActivate> => {
    @Injectable()
    class UserTypeGuardMixin implements CanActivate {
        constructor(
            @InjectModel(User.name) public readonly userModel: Model<UserDocument>,
        ) { }

        async canActivate(context: ExecutionContext): Promise<boolean> {
            const request = context.switchToHttp().getRequest();

            // Ensure AuthGuard has run first
            if (!request.user) {
                throw new ForbiddenException('يجب تسجيل الدخول أولاً');
            }

            const user = request.user;

            if (!user.id) {
                throw new ForbiddenException('المستخدم غير مصادق عليه');
            }

            const userDoc = await this.userModel.findById(user.id).exec();

            if (!userDoc) {
                throw new ForbiddenException('المستخدم غير موجود');
            }

            if (!types.includes(userDoc.type)) {
                throw new ForbiddenException('ليس لديك صلاحية للوصول إلى هذا المورد');
            }

            return true;
        }
    }

    return mixin(UserTypeGuardMixin);
}