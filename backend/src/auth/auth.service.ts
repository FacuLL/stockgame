import { Injectable } from '@nestjs/common';
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

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(BasicUser) private readonly basicUserRepostory: Repository<BasicUser>,
        @InjectRepository(Institution) private readonly institutionRepostory: Repository<Institution>,
        @InjectRepository(User) private readonly userRepostory: Repository<User>,
        @InjectRepository(Admin) private readonly adminRepostory: Repository<Admin>,
        private jwtService: JwtService
    ) {}

    async loginInstitution(req: InstitutionRequest) {
        const payload: JWTRequestContent = { userid: req.user.user.userid, type: "institution", entityid: req.user.institutionid };
        return {
          access_token: this.jwtService.sign(payload),
        };
    }

    async validateInstitution(data: InstitutionLoginDto): Promise<Institution> {
        const institution: Institution = await this.institutionRepostory.findOne({ where: { email: data.email } });
        if (!await institution.comparePassword(data.password)) return null;
        return institution;
    }

    async loginUser(req: BasicUserRequest) {
        const payload: JWTRequestContent = { userid: req.user.user.userid, type: "basicuser", entityid: req.user.basicuserid };
        return {
          access_token: this.jwtService.sign(payload),
        };
    }

    async validateUser(data: BasicUserLoginDto): Promise<BasicUser> {
        let options: FindOneOptions = { where: { username: data.username }, relations: ['user'], select: ['basicuserid', 'username', 'password'] };
        const user: BasicUser = await this.basicUserRepostory.findOne(options);
        if (!user || !await user.comparePassword(data.password)) return null;
        return user;
    }

    async loginAdmin(req: AdminRequest) {
        const payload: AdminJWTRequestContent = { userid: req.user.user.userid, type: "admin", entityid: req.user.adminid, admin: true };
        return {
          access_token: this.jwtService.sign(payload),
        };
    }

    async validateAdmin(data: AdminLoginDto): Promise<Admin> {
        let options: FindOneOptions = { where: { username: data.username }, relations: ['user'], select: ['adminid', 'username', 'password'] };
        const admin: Admin = await this.adminRepostory.findOne(options);
        if (!admin || !await admin.comparePassword(data.password) || admin.user.type != "admin") return null;
        return admin;
    }

    async validateJWTAdmin(userid: number, adminid: number): Promise<Boolean> {
        const user: User = await this.userRepostory.findOne({ where: { userid: userid }, relations: { admin: true } });
        if (user.type != "admin" || user.admin.adminid != adminid) return false;
        return true;
    }
}
