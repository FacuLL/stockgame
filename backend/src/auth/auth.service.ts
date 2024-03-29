import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasicUser } from 'src/entities/basicuser/entities/basicuser.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { BasicUserLoginDto } from './basicuser/userlogin.dto';
import { JwtService } from '@nestjs/jwt';
import { BasicUserRequest } from './basicuser/basicuser.request';
import { JWTRequestContent } from './jwt/jwt.request';
import { Institution } from 'src/entities/institution/entities/institution.entity';
import { InstitutionLoginDto } from './institution/insitutionlogin.dto';
import { InstitutionRequest } from './institution/institution.request';
import { User } from 'src/entities/user/entities/user.entity';
import { Admin } from 'src/entities/admin/entities/admin.entity';
import { AdminLoginDto } from './admin/adminlogin.dto';
import { AdminRequest } from './admin/admin.request';
import { AdminJWTRequestContent } from './admin-jwt/admin-jwt.request';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(BasicUser) private readonly basicUserRepostory: Repository<BasicUser>,
        @InjectRepository(Institution) private readonly institutionRepostory: Repository<Institution>,
        @InjectRepository(User) private readonly userRepostory: Repository<User>,
        @InjectRepository(Admin) private readonly adminRepostory: Repository<Admin>,
        private jwtService: JwtService
    ) {}

    async loginInstitution(req: InstitutionRequest, res: Response) {
        const payload: JWTRequestContent = { userid: req.user.userid, type: "institution", entityid: req.user.institution.institutionid };
        res.cookie('accessToken', this.jwtService.sign(payload), {
            expires: new Date(new Date().getTime() + 24 * 10 * 60 * 60 * 1000),
            sameSite: process.env.PROTOCOL == 'HTTPS' ? 'strict' : 'lax',
            secure: process.env.PROTOCOL == 'HTTPS',
            httpOnly: true,
        });
        return res.status(201).send(req.user);
    }

    async validateInstitution(data: InstitutionLoginDto): Promise<User> {
        let options: FindOneOptions = { where: { email: data.email }, relations: ['user', 'user.institution'], select: ['institutionid', 'email', 'password'] };
        const institution: Institution = await this.institutionRepostory.findOne(options);
        if (!institution || !await institution.comparePassword(data.password)) return null;
        return institution.user;
    }

    loginUser(req: BasicUserRequest, res: Response) {
        const payload: JWTRequestContent = { userid: req.user.userid, type: "basicuser", entityid: req.user.basicuser.basicuserid };
        res.cookie('accessToken', this.jwtService.sign(payload), {
            expires: new Date(new Date().getTime() + 24 * 10 * 60 * 60 * 1000),
            sameSite: process.env.PROTOCOL == 'HTTPS' ? 'strict' : 'lax',
            secure: process.env.PROTOCOL == 'HTTPS',
            httpOnly: true,
        });
        return res.status(201).send(req.user);
    }

    async validateUser(data: BasicUserLoginDto): Promise<User> {
        let options: FindOneOptions = { where: { username: data.username }, relations: ['user', 'user.basicuser'], select: ['basicuserid', 'username', 'password'] };
        const user: BasicUser = await this.basicUserRepostory.findOne(options);
        if (!user || !await user.comparePassword(data.password)) return null;
        user.deletePassword();
        return user.user;
    }

    async loginAdmin(req: AdminRequest, res: Response) {
        const payload: AdminJWTRequestContent = { userid: req.user.userid, type: "admin", entityid: req.user.admin.adminid, admin: true };
        res.cookie('accessToken', this.jwtService.sign(payload), {
            expires: new Date(new Date().getTime() + 24 * 10 * 60 * 60 * 1000),
            sameSite: process.env.PROTOCOL == 'HTTPS' ? 'strict' : 'lax',
            secure: process.env.PROTOCOL == 'HTTPS',
            httpOnly: true,
        });
        return res.status(201).send(req.user);
    }

    async validateAdmin(data: AdminLoginDto): Promise<User> {
        let options: FindOneOptions = { where: { username: data.username }, relations: ['user', 'user.admin'], select: ['adminid', 'username', 'password'] };
        const admin: Admin = await this.adminRepostory.findOne(options);
        if (!admin || !await admin.comparePassword(data.password) || admin.user.type != "admin") return null;
        return admin.user;
    }

    async validateJWTAdmin(userid: number, adminid: number): Promise<Boolean> {
        const user: User = await this.userRepostory.findOne({ where: { userid: userid }, relations: { admin: true } });
        if (user.type != "admin" || user.admin.adminid != adminid) return false;
        return true;
    }

    async logout(res: Response) {
        res.clearCookie('accessToken', {
            expires: new Date(new Date().getTime() + 24 * 10 * 60 * 60 * 1000),
            sameSite: process.env.PROTOCOL == 'HTTPS' ? 'strict' : 'lax',
            secure: process.env.PROTOCOL == 'HTTPS',
            httpOnly: true,
        });
        return res.sendStatus(200);
    }
}
