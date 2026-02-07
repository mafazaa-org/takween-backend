import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EntityModule } from './entity/entity.module';
import { ActivityModule } from './activity/activity.module';
import { ClassroomModule } from './classroom/classroom.module';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentModule } from './student/student.module';
import { TokenModule } from './token/token.module';
import { UserModule } from './user/user.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { SittingModule } from './sitting/sitting.module';
import { TeacherModule } from './teacher/teacher.module';
import { MemberModule } from './member/member.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ReportModule } from './report/report.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { HomeworkModule } from './homework/homework.module';
import { ContentModule } from './content/content.module';
import { MessageModule } from './message/message.module';

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
    TokenModule,
    UserModule,
    SittingModule,
    TeacherModule,
    MemberModule,
    AttendanceModule,
    ScheduleModule,
    ReportModule,
    EvaluationModule,
    HomeworkModule,
    ContentModule,
    MessageModule,
  ],
  providers: [LoggerMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
