import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAuthGuard } from './user/user.guard';
import { Public } from './public/public.decorator';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Public()
    @UseGuards(UserAuthGuard)
    @Post('login/user')
    userLogin(@Request() req) {
        return this.authService.login(req.user);
    }
}
