import { CatsRequestDto } from '../dto/cats.request.dto';
import { Injectable, HttpException, UnauthorizedException, Inject } from '@nestjs/common';
import { Cat } from '../cats.schema';
import * as bcrypt from 'bcrypt';
import { CatsRepository } from '../cats.repository';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';

@Injectable()
export class CatsService {
  constructor(
    private readonly catsRepository: CatsRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) { }


  async getAllCat() {
    const allCat = await this.catsRepository.findAll();
    const readOnlyCats = allCat.map((cat) => cat.readOnlyData);
    this.logger.info(`getAllCat: ${readOnlyCats.length}`, { len: readOnlyCats.length });

    return readOnlyCats;
  }

  // 유효성 검사 -> 수행 패스워드 암호화 -> DB저장
  async signUp(body: CatsRequestDto) {
    const { email, name, password } = body;

    const isCatExist = await this.catsRepository.existsByEmail(email);

    if (isCatExist) { // 해당 이메일이 존재한다면
      throw new UnauthorizedException('해당하는 고양이는 이미 존재함');
      // throw new HttpException('해당하는 고양이는 이미 존재함', 403);  // 위와 동일
    }

    // 패스워드 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 암호 저장
    const cat = await this.catsRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return cat.readOnlyData;
  }

  async uploadImg(cat: Cat, files: Express.Multer.File[]) {
    const fileName = `cats/${files[0].filename}`; // 첫 인자에 파일 이름

    console.log('fileName', fileName);

    const newCat = await this.catsRepository.findByIdAndUpdateImg(
      cat.id,
      fileName,
    );
    console.log('newCat', newCat);
    return newCat;
  }
}
