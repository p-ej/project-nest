import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { tap } from "rxjs/operators";


@Injectable()
export class SuccessInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        // console.log('Before.');

        // controller로 return된 값을 받는다 인자는 data
        return next.handle().pipe(map((data) => ({
            success: true,
            data,
        })), tap(() => console.log('After.'))
        );
    }
}