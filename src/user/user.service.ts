import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { PhoneRegisterDto } from "./dto/phone-register.dto";
import { PhoneVerifyDto } from './dto/phone-verify.dto';
import { TokenService } from 'src/token/token.service';
import { VerificationCodeService } from 'src/token/verification-code.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly tokenService: TokenService,
        private readonly verificationCodeService: VerificationCodeService,
    ) { }

    async phoneRegister(data: PhoneRegisterDto) {
        let user = await this.userModel.findOne({ phone: data.phone }).exec();
        if (!user) {
            user = new this.userModel(data);
        }
        await this.verificationCodeService.generateVerificationCode(data.phone);
        return user.save();
    }

    async phoneVerify(data: PhoneVerifyDto) {
        const user = await this.userModel.findOne({ phone: data.phone }).exec();

        if (!user) {
            throw new NotFoundException('بيانات الدخول غير صحيحة');
        }

        //TODO: Verify code
        await this.verificationCodeService.verifyVerificationCode({ phone: data.phone, code: data.code });

        const accessToken = await this.tokenService.generateAccessToken({
            id: user._id,
            name: user.name,
            phone: user.phone,
        });

        const refreshToken = await this.tokenService.generateRefreshToken(
            user,
        );

        return {
                id: user._id,
                name: user.name,
                phone: user.phone,
                accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }

    async getUser(id: string) {
        return this.userModel.findById(id).exec();
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        return this.userModel
            .findByIdAndUpdate(id, updateUserDto, {
                new: true,
            })
            .exec();
    }

    async delete(id: string) {
        await this.userModel.findByIdAndDelete(id).exec();
        return 'تم حذف المستخدم بنجاح';
    }


}
