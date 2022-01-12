import { CatsService } from './cats/services/cats.service';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly catsService: CatsService,
  ) { }

  //* localhost:8000/cats/hello
  // @Get('hello/:id/:name')
  // getHello(
  //   @Req() req: Request,
  //   @Body() Body: any,
  //   @Param() param: { id: string; name: string },
  // ): string {
  //   console.log(req);
  //   console.log(param);
  //   return this.appService.getHello();
  // }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


}
