import { Controller, Get, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicUserAuthGuard } from './basicuser/basicuser.guard';
import { Public } from './public/public.decorator';
import { BasicUserRequest } from './basicuser/basicuser.request';
import { InstitutionRequest } from './institution/institution.request';
import { InstitutionAuthGuard } from './institution/institution.guard';
import { AdminRequest } from './admin/admin.request';
import { AdminAuthGuard } from './admin/admin.guard';
import { Response as ResponseType } from 'express';
import { JWTRequest } from './jwt/jwt.request';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Public()
    @UseGuards(BasicUserAuthGuard)
    @Post('login/user')
    userLogin(@Request() req: BasicUserRequest, @Response() res: ResponseType) {
        return this.authService.loginUser(req, res);
    }

    @Public()
    @UseGuards(InstitutionAuthGuard)
    @Post('login/institution')
    institutionLogin(@Request() req: InstitutionRequest, @Response() res: ResponseType) {
        return this.authService.loginInstitution(req, res);
    }

    @Public()
    @UseGuards(AdminAuthGuard)
    @Post('login/admin')
    adminLogin(@Request() req: AdminRequest, @Response() res: ResponseType) {
        return this.authService.loginAdmin(req, res);
    }

    @Get('validate')
    validate() {
        return true;
    }

    @Public()
    @Get('logout')
    logout(@Response() res: ResponseType) {
        return this.authService.logout(res);
    }
}
