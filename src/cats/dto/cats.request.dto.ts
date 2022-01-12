import { Cat } from '../cats.schema';
import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CatsRequestDto extends PickType(Cat, [
    'email',
    'name',
    'password',
] as const) { }