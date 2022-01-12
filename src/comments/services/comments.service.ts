import { CatsRepository } from 'src/cats/cats.repository';
import { CommentsCreateDto } from '../dtos/comments.create.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comments } from '../comments.schema';
import { Model } from 'mongoose';

@Injectable()
export class CommentsService {

    constructor(
        @InjectModel(Comments.name) private readonly commentsModel: Model<Comments>,
        private readonly catsRepository: CatsRepository,
    ) {

    }
    async getAllComments() {
        try {
            const comments = await this.commentsModel.find();
            return comments;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async createComments(catId: string, commentData: CommentsCreateDto) {
        console.log('comments', commentData);
        try {
            const targetCat = await this.catsRepository.findCatByIdWithoutPassword(
                catId,
            );
            const { contents, author } = commentData;
            const valitdatedAuthor =
                await this.catsRepository.findCatByIdWithoutPassword(author);
            const newComment = new this.commentsModel({
                author: valitdatedAuthor._id,
                contents,
                info: targetCat._id,
            });
            return await newComment.save();
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async plusLike(catId: string) {
        try {
            const comment = await this.commentsModel.findById(catId);
            comment.likeCount += 1;
            return await comment.save();
        } catch (error) { }
    }
}
