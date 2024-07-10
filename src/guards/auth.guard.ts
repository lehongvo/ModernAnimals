import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

export class AuthGuardCLT implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        return request.session?.userId;
    }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }