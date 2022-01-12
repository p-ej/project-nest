import { CatsRepository } from 'src/cats/cats.repository';
import { Payload } from './jwt.payload';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly catsRepository: CatsRepository,
    ) {
        super({ // jwt에 대한 설정
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더의 토큰으로부터 추출한다. 
            secretOrKey: process.env.JWT_SECRET,
            ignoreExpiration: false, // jwt는 만료기한이 존재한다. 
        });
    }

    // guard로 인한 validation
    async validate(payload: Payload) {
        // 디코딩된 페이로드가 적합한지 체크해야함.
        const cat = await this.catsRepository.findCatByIdWithoutPassword(
            payload.sub,
        );

        if (cat) {
            return cat; // request.user 단에 cat이 들어가게 된다.
        } else {
            throw new UnauthorizedException('접근 오류');
        }
    }
}