import { CommentsService } from './../services/comments.service';
import { Body, Controller, Get, Inject, Logger, LoggerService, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CommentsCreateDto } from '../dtos/comments.create.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';

@Controller('comments')
export class CommentsController {

    constructor(
        private readonly commentsService: CommentsService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    ) { }

    @ApiOperation({ summary: '모든 고양이 프로필에 적힌 댓글 가져오기' })
    @Get('')
    async getAllComments() {
        this.logger.info('getAllComments', this.commentsService.getAllComments())
        return this.commentsService.getAllComments();
    }

    @ApiOperation({ summary: '특정 고양이 프로필에 댓글 남기기' })
    @Post(':id')
    async createComments(
        @Param('id') catId: string,
        @Body() body: CommentsCreateDto,
    ) {

        return this.commentsService.createComments(catId, body);
    }

    @ApiOperation({ summary: '좋아요 수 올리기' })
    @Patch(':id')
    async plusLike(
        @Param('id') catId: string,
    ) {
        return this.commentsService.plusLike(catId);
    }

}
