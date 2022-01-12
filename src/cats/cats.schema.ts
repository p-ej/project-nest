import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Document, SchemaOptions } from 'mongoose';
import { Comments } from "src/comments/comments.schema";

// 시간 
const options: SchemaOptions = {
    timestamps: true,
};

// 스키마 단계에서 패스워드 숨기기 : 몽구스는 버츄어필드라는 것을 제공해준다.
// 실제 디비에 사용되는 필드가 아니고 비즈니스 로직에서 사용할 수 있는 필드
@Schema(options)
export class Cat extends Document {

    @ApiProperty({
        example: 'aaaa@naver.com',
        description: 'email',
        required: true
    })
    @Prop({
        required: true,
        unique: true,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'pej',
        description: 'name',
        required: true
    })
    @Prop({
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: '1234',
        description: 'password',
        required: true
    })
    @Prop({
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @Prop({
        default: 'https://raw.githubusercontent.com/amamov/teaching-nestjs-a-to-z/main/images/1.jpeg',
    })
    @IsString()
    imgUrl: string;

    readonly readOnlyData: {
        id: string;
        email: string;
        name: string;
        imgUrl: string;
        comments: Comments[];
    };

    readonly comments: Comments[];
}

const _CatSchema = SchemaFactory.createForClass(Cat);

_CatSchema.virtual('readOnlyData').get(function (this: Cat) {
    return {
        id: this.id,
        email: this.email,
        name: this.name,
        imgUrl: this.imgUrl,
        comments: this.comments,
    };
});

_CatSchema.virtual('comments', {
    ref: 'comments', // 해당 스키마 이름 .
    localField: '_id',
    foreignField: 'info',
});
_CatSchema.set('toObject', { virtuals: true });
_CatSchema.set('toJSON', { virtuals: true });

export const CatSchema = _CatSchema;