import { ConfigModule } from '@nestjs/config';
import { CommentsModule } from './../comments/comments.module';
import { AuthModule } from './../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, forwardRef } from '@nestjs/common';
import { CatsController } from './controllers/cats.controller';
import { CatsService } from './services/cats.service';
import { Cat, CatSchema } from './cats.schema';
import { CatsRepository } from './cats.repository';
import { MulterModule } from '@nestjs/platform-express';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { Comments, CommentsSchema } from 'src/comments/comments.schema';
import { MulterExtendedModule } from 'nestjs-multer-extended';
// import dayjs from 'dayjs';
var S3StreamLogger = require('s3-streamlogger').S3StreamLogger;
const dayjs = require('dayjs');

var s3_stream = new S3StreamLogger({
  bucket: 'nest-logs', // S3 버킷 이름
  folder: `logs/${dayjs().format('YYYY-MM-DD')}`, // 로그 저장위치 S3 폴더 
  // tags: { type: 'log', project: 'logpro' },
  access_key_id: process.env.AWS_S3_ACCESS_KEY,
  secret_access_key: process.env.AWS_S3_SECRET_KEY,
  // storage_class: 'STANDARD'
});
@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './upload', // upload라는 폴더에 저장이 된다는 의미
    }),
    MulterExtendedModule.register({
      awsConfig: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY,
        region: process.env.AWS_S3_REGION,
        // ... any options you want to pass to the AWS instance
      },
      bucket: process.env.AWS_S3_BUCKET_NAME,
      basePath: 'cis', // 파일이 업로드 될때 s3에서 기본적으로 어떤 경로로 파일이 업로드 될지
      fileSize: 1 * 1024 * 1024,
    }),
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
      { name: Cat.name, schema: CatSchema }
    ]),
    forwardRef(() => AuthModule),

    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          // level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('CATS', { prettyPrint: true }),
          ),
        }),
        new (require('winston-daily-rotate-file'))({
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.printf(
              (info) =>
                `[${info.timestamp}] production.${info.level}: ${info.message}`,
            ),
          ),
          filename: 'responder-logs/%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
        new winston.transports.Stream({
          stream: s3_stream,
          eol: '\n',
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            winston.format.printf(
              (info) =>
                `[${info.timestamp}] production.${info.level}: ${info.message}`,
            ),
          ),
        }),
      ],
    }),

    // forwardRef(() => CommentsModule),
  ],
  controllers: [CatsController],
  providers: [CatsService, CatsRepository],
  exports: [CatsService, CatsRepository], // 내보내기
})
export class CatsModule { }
