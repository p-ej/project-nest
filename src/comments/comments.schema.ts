import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsPositive, IsString } from "class-validator";
import { Document, SchemaOptions, Types } from 'mongoose';

// 시간 
const options: SchemaOptions = {
    timestamps: true,
    collection: 'comments',
};

// 스키마 단계에서 패스워드 숨기기 : 몽구스는 버츄어필드라는 것을 제공해준다.
// 실제 디비에 사용되는 필드가 아니고 비즈니스 로직에서 사용할 수 있는 필드
@Schema(options)
export class Comments extends Document {

    @ApiProperty({
        description: '작성 고양이 id',
        required: true
    })
    @Prop({
        type: Types.ObjectId, // 몽고디비의 타입 오브젝트 아이디
        required: true,
        ref: 'cats' // 도큐멘트 이름 
    })
    @IsString()
    @IsNotEmpty()
    author: Types.ObjectId; // 저자 

    @ApiProperty({
        description: '댓글 컨텐츠(내용)',
        required: true
    })
    @Prop({
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    contents: string;

    @ApiProperty({
        description: '좋아요 수',
    })
    @Prop({
        default: 0,
    })
    @IsPositive()
    likeCount: number;

    @ApiProperty({
        description: '작성 대상 (게시물, 정보글)',
        required: true
    })
    @Prop({
        type: Types.ObjectId,
        required: true,
        ref: 'cats' // 도큐멘트 이름 
    })
    @IsNotEmpty()
    info: Types.ObjectId; // 어떤 정보에다가 썼는지도 알아야 함. 자기 자신한테 댓글을 남길수도 있음. 

}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
