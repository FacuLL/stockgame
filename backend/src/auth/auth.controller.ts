import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BasicUserAuthGuard } from './basicuser/basicuser.guard';
import { Public } from './public/public.decorator';
import { BasicUserRequest } from './basicuser/basicuser.request';
import { InstitutionRequest } from './institution/institution.request';
import { InstitutionAuthGuard } from './institution/institution.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Public()
    @UseGuards(BasicUserAuthGuard)
    @Post('login/user')
    userLogin(@Request() req: BasicUserRequest) {
        return this.authService.loginUser(req);
    }

    @Public()
    @UseGuards(InstitutionAuthGuard)
    @Post('login/institution')
    institutionLogin(@Request() req: InstitutionRequest) {
        return this.authService.loginInstitution(req);
    }
}
