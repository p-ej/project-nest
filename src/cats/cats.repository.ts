import { CatsRequestDto } from './dto/cats.request.dto';
import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Cat } from "./cats.schema";
import * as mongoose from 'mongoose';
import { CommentsSchema } from 'src/comments/comments.schema';

@Injectable()
export class CatsRepository {
    constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) { }

    async findAll() {
        const CommentsModel = mongoose.model('comments', CommentsSchema);

        const result = await this.catModel
            .find()
            .populate('comments', CommentsModel); // 다른 도큐먼트랑 이어줄 수 있는 메서드 

        return result;
    }

    async findByIdAndUpdateImg(id: string, fileName: string) {
        const cat = await this.catModel.findById(id);
        cat.imgUrl = `http://localhost:8000/media/${fileName}`;
        const newCat = await cat.save();
        console.log('newCat', newCat);
        return newCat.readOnlyData;
    }

    async findCatByIdWithoutPassword(
        catId: string | Types.ObjectId,
    ): Promise<Cat | null> {
        const cat = await this.catModel.findById(catId).select('-password'); // password 필드를 제외하고 조회한다. 
        // ('email name') -- 이메일하고 이름만 가져온다. 
        return cat;
    }

    async findCatByEmail(email: string): Promise<Cat | null> {
        const cat = await this.catModel.findOne({ email });
        return cat;
    }

    // async findCatByPassward(passward: string): Promise

    async existsByEmail(email: string): Promise<boolean> {
        const result = await this.catModel.exists({ email });
        return result;
    }

    async create(cat: CatsRequestDto): Promise<Cat> {
        return await this.catModel.create(cat);
    }
}