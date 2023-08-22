import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { USER_TYPE } from 'src/types/users.type';
import { AdminJWTRequest } from './admin-jwt.request';

@Injectable()
export class AdminJWTAuthGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req: AdminJWTRequest = context.switchToHttp().getRequest();
        if (!req.user?.admin || req.user?.type != USER_TYPE.ADMIN) throw new UnauthorizedException();
        const isAdmin: Boolean = await this.authService.validateJWTAdmin(req.user?.userid, req.user?.entityid);
        if (!isAdmin) throw new UnauthorizedException();
        return true;
    }
}