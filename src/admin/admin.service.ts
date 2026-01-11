import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './admin.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { RegisterAdminDto } from './dto/register-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private readonly tokenService: TokenService,
  ) {}

  async register(createAdminDto: RegisterAdminDto) {
    const existingAdmin = await this.adminModel
      .findOne({ phone: createAdminDto.phone })
      .exec();
    if (existingAdmin) {
      throw new ConflictException('Phone number already registered');
    }

    const newAdmin = new this.adminModel(createAdminDto);
    return newAdmin.save();
  }

  async login(phone: string, password: string) {
    const admin = await this.adminModel
      .findOne({ phone })
      .select('+password')
      .exec();

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.tokenService.generateAccessToken({
      id: admin._id,
      name: admin.name,
      phone: admin.phone,
    });

    const refreshToken = await this.tokenService.generateRefreshToken(
      admin as unknown as AdminDocument,
    );

    return {
      admin: {
        id: admin._id,
        name: admin.name,
        phone: admin.phone,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  }

  async getAdmin() {
    return this.adminModel.findById('6963884fb88499a133e0d198').exec();
  }

  async update(updateAdminDto: UpdateAdminDto) {
    return this.adminModel
      .findByIdAndUpdate('6963884fb88499a133e0d198', updateAdminDto, {
        new: true,
      })
      .exec();
  }

  async delete() {
    await this.adminModel.findByIdAndDelete('6963884fb88499a133e0d198').exec();
    return 'Admin deleted successfully';
  }
}
