import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicUser } from 'src/basicuser/entities/basicuser.entity';
import { Repository } from 'typeorm';
import { UserLoginDto } from './dto/userlogin.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(BasicUser) private readonly basicUserRepostory: Repository<BasicUser>,
        private jwtService: JwtService
    ) {}

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }

    async validateUser(data: UserLoginDto): Promise<BasicUser> {
        const user: BasicUser = await this.basicUserRepostory.findOne({ where: { username: data.username } })
        if (!await user.comparePassword(data.password)) return null
        user.removeSensibleData();
        return user;
      }
}
