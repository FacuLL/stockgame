import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { JWTRequest } from 'src/auth/jwt/jwt.request';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicUser } from '../basicuser/entities/basicuser.entity';
import { Institution } from '../institution/entities/institution.entity';
import { BasicuserService } from '../basicuser/basicuser.service';
import { InstitutionService } from '../institution/institution.service';
import { FindUserDto } from './dto/find-user.dto';
import { USER_TYPE } from 'src/types/users.type';
import { Admin } from '../admin/entities/admin.entity';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepostory: Repository<User>,
    private basicuserService: BasicuserService,
    private institutionService: InstitutionService,
    private adminService: AdminService
  ) {}

  findAll(params: FindUserDto): Promise<User[]> {
    return this.userRepostory.find({ where: { ...params }, relations: { institution: true, basicuser: true } });
  }

  findOne(id: number): Promise<User> {
    return this.userRepostory.findOne({ where: { userid: id }, relations: { institution: true, basicuser: true } });
  }

  async deleteAccount(req: JWTRequest): Promise<HttpStatus> {
    let user: User = await this.userRepostory.findOne({ where: { userid: req.user.userid } });
    if (!user || user.type != req.user.type) throw new UnauthorizedException();
    await this.userRepostory.delete(user.userid);
    return HttpStatus.OK;
  }

  async delete(id: number): Promise<HttpStatus> {
    let user: User = await this.userRepostory.findOne({ where: { userid: id } });
    if (!user) throw new NotFoundException();
    await this.userRepostory.delete(user.userid);
    return HttpStatus.OK;
  }

  async getProfile(req: JWTRequest): Promise<User> {
      console.log(req.user);
    
      let user: User = await this.userRepostory.findOne({ where: { userid: req.user.userid }, relations: { institution: true, basicuser: true } });
      if (!user) throw new UnauthorizedException();
      return user;
  }
  
  // async getProfile(req: JWTRequest): Promise<any> {
  //   let entity: any;
  //   switch(req.user.type) {
  //     case USER_TYPE.BASICUSER:
  //       entity = await this.basicuserService.findOne(req.user.entityid);
  //       break;
  //     case USER_TYPE.INSTITUTION:
  //       entity = await this.institutionService.findOne(req.user.entityid);
  //       break;
  //     case USER_TYPE.ADMIN:
  //       entity = await this.adminService.findOne(req.user.entityid);
  //       break;
  //     default:
  //       throw new UnauthorizedException();
  //   }
  //   if (!entity || entity.user.userid != req.user.userid) throw new UnauthorizedException();
  //   return entity;
  // }
}
