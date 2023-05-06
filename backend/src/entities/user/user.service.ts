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

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private readonly userRepostory: Repository<User>,
    private basicuserService: BasicuserService,
    private institutionService: InstitutionService
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

  async getProfile(req: JWTRequest): Promise<User | BasicUser | Institution> {
    let entity: User | BasicUser | Institution;
    switch(req.user.type) {
      case "basicuser":
        entity = await this.basicuserService.findOne(req.user.entityid);
        if (entity.user.userid != req.user.userid) throw new UnauthorizedException();
        break;
      case "institution":
        entity = await this.institutionService.findOne(req.user.entityid);
        if (entity.user.userid != req.user.userid) throw new UnauthorizedException();
        break;
      default:
        entity = await this.findOne(req.user.userid);
        if (entity.type != req.user.type) throw new UnauthorizedException();
        break;
    }
    if (!entity) throw new UnauthorizedException();
    return entity;
  }
}
