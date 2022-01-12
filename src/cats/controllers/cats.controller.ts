import { CurrentUser } from '../../common/decorators/user.decorator';
import { LoginRequestDto } from '../../auth/dto/login.request.dto';
import { AuthService } from '../../auth/auth.service';
import { Cat } from '../cats.schema';
import { CatsService } from '../services/cats.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UploadedFiles,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PositiveIntePipe } from 'src/common/pipes/positiveInt.pipe';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CatsRequestDto } from '../dto/cats.request.dto';
import { ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReadOnlyCatDto } from '../dto/cat.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { Request } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer.options';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';
import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';

// @UseFilters(HttpExceptionFilter)
@Controller('cats')
@UseInterceptors(SuccessInterceptor)
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) { }

  @ApiOperation({ summary: '현재 고양이 가져오기' })
  @UseGuards(JwtAuthGuard) // 인증 처리 된 정보를 @Req 넣기
  @Get()
  async getCurrentCat(@CurrentUser() cat) {

    return cat.readOnlyData;
  }

  @ApiResponse({
    status: 500,
    description: 'Server Error...'
  })
  @ApiResponse({
    status: 200,
    description: 'Success!',
    type: ReadOnlyCatDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signUp(@Body() body: CatsRequestDto) {
    console.log(body);
    return await this.catsService.signUp(body); // 몽고디비에서 데이터를 가져옴 
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {

    return this.authService.jwtLogIn(data);
  }

  @ApiOperation({ summary: '고양이 이미지 업로드' })
  @UseGuards(JwtAuthGuard)
  // @UseInterceptors(FilesInterceptor('image', 10, multerOptions("cats"))) 
  @UseInterceptors(
    AmazonS3FileInterceptor('image', { //프론트의 필드 이미지 image , 싱글 파일만 업로드 가능 
      dynamicPath: 'cats'
    }),
  )
  @Post('upload')
  async uploadCatImg(
    @UploadedFile() file: any,
    @CurrentUser() cat: Cat
  ) {
    console.log(file);
    // return 'uploadImg';
    // return { image: `http://localhost:8000/media/cats/${files[0].filename}` };
    // return this.catsService.uploadImg(cat, files); // 로그인된 현재 자신의 정보 

  }

  @ApiOperation({ summary: '모든 고양이 가져오기 ' })
  @Get('all')
  async getAllCat() {
    this.logger.info('cats all controller');
    return this.catsService.getAllCat();
  }
}
