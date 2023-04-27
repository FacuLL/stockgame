import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateBasicuserDto } from './dto/create-basicuser.dto';
import { UpdateBasicuserDto } from './dto/update-basicuser.dto';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { BasicUser } from './entities/basicuser.entity';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { generateHash } from 'src/utils/passwords';
import { FindBasicuserDto } from './dto/find-basicuser.dto';
import { JWTRequest } from 'src/auth/jwt/jwt.request';
import { deleteEmptyFields } from 'src/utils/data-transform';

@Injectable()
export class BasicuserService {

  constructor(
    @InjectRepository(BasicUser) private readonly basicUserRepostory: Repository<BasicUser>,
    private dataSource: DataSource
  ) {}

  async create(createUserDto: CreateUserDto, createBasicuserDto: CreateBasicuserDto): Promise<HttpStatus> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let user: User = new User(createUserDto, "basicuser");
      createBasicuserDto.password = await generateHash(createBasicuserDto.password);
      let basicuser: BasicUser = new BasicUser(createBasicuserDto, user);
      await queryRunner.manager.save(user);
      await queryRunner.manager.save(basicuser);
      await queryRunner.commitTransaction();
      return HttpStatus.OK;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(e.message, e.status);
    } finally {
      await queryRunner.release();
    }
  }

  async update(req: JWTRequest, updateBasicuserDto: UpdateBasicuserDto): Promise<HttpStatus> {
    if (req.user.type != "basicuser") throw new UnauthorizedException();
    let basicuser: BasicUser = await this.findOne(req.user.entityid);
    if (!basicuser || basicuser.user.userid != req.user.userid) throw new UnauthorizedException();
    updateBasicuserDto = deleteEmptyFields(updateBasicuserDto);
    basicuser.updateData(updateBasicuserDto);
    return HttpStatus.OK;
  }

  // ADMINS 

  findAll(params: FindBasicuserDto): Promise<BasicUser[]> {
    let options: FindManyOptions<BasicUser> = { where: {...params}, relations: { user: true } };
    return this.basicUserRepostory.find(options);
  }

  findOne(id: number): Promise<BasicUser> {
    return this.basicUserRepostory.findOne({ where: { basicuserid: id }, relations: { user: true } });
  }

  async delete(id: number): Promise<HttpStatus> {
    let basicuser: BasicUser = await this.basicUserRepostory.findOne({ where: { basicuserid: id } });
    if (!basicuser) throw new NotFoundException();
    await this.basicUserRepostory.delete(id);
    return HttpStatus.OK;
  }
}
