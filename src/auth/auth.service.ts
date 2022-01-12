import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CatsRepository } from 'src/cats/cats.repository';
import { LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly catsRepository: CatsRepository,
        private jwtService: JwtService, // author.module IN JwtModule에서 제공하는 공급자.
    ) { }

    async jwtLogIn(data: LoginRequestDto) {
        const { email, password } = data;

        // 이메일 검증
        const cat = await this.catsRepository.findCatByEmail(email);

        if (!cat) {
            throw new UnauthorizedException('이메일을 확인해라');
        }

        // 패스워드 검증
        const isPasswordValidated: boolean = await bcrypt.compare(
            password,
            cat.password,
        );

        if (!isPasswordValidated) {
            throw new UnauthorizedException('비밀번호를 확인하도록');
        }

        const payload = { email: email, sub: cat.id }; // sub : 토큰 제목 cat 의 고유 식별자

        return {
            token: this.jwtService.sign(payload), // sign 함수를 이용해 토큰을 만들어낸다. 
        };

    }
}
