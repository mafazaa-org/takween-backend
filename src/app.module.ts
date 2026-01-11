import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EntityModule } from './entity/entity.module';
import { ActivityModule } from './activity/activity.module';
import { ClassroomModule } from './classroom/classroom.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';
import { ParentModule } from './parent/parent.module';
import { AdminModule } from './admin/admin.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    EntityModule,
    ActivityModule,
    ClassroomModule,
    StudentModule,
    ParentModule,
    AdminModule,
    TokenModule,
  ],
})
export class AppModule {}
