import { HttpException, Injectable } from '@nestjs/common';
import { CreateBasicuserDto } from './dto/create-basicuser.dto';
import { UpdateBasicuserDto } from './dto/update-basicuser.dto';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { BasicUser } from './entities/basicuser.entity';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { generateHash } from 'src/utils/passwords';
import { FindBasicuserDto } from './dto/find-basicuser.dto';

@Injectable()
export class BasicuserService {

  constructor(
    @InjectRepository(BasicUser) private readonly basicUserRepostory: Repository<BasicUser>,
    @InjectRepository(User) private readonly userRepostory: Repository<User>,
    private dataSource: DataSource
  ) {}

  async create(createUserDto: CreateUserDto, createBasicuserDto: CreateBasicuserDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let user: User = new User(createUserDto, "basicuser");
      createBasicuserDto.password = await generateHash(createBasicuserDto.password);
      let basicuser: BasicUser = new BasicUser(createBasicuserDto, user);
      await queryRunner.manager.save(user);
      let created: BasicUser = await queryRunner.manager.save(basicuser);
      await queryRunner.commitTransaction();
      return created;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(e.message, e.status);
    } finally {
      await queryRunner.release();
    }
  }

  findAll(params: FindBasicuserDto): Promise<BasicUser[]> {
    let options: FindManyOptions<BasicUser> = {where: {...params}, relations: {user: true}};
    return this.basicUserRepostory.find(options);
  }

  findOne(id: number): Promise<BasicUser> {
    return this.basicUserRepostory.findOne({where: {basicuserid: id}});
  }
}
