import { CatsModule } from './../cats/cats.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Module, Logger, forwardRef } from '@nestjs/common';
import { CommentsController } from './controllers/comments.controller';
import { CommentsService } from './services/comments.service';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { Comments, CommentsSchema } from './comments.schema';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          // level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('COMMENTS', { prettyPrint: true }),
          ),
        }),
      ],
    }),
    forwardRef(() => CatsModule),
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema }
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule { }
