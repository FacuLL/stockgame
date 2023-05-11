import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { User } from 'src/entities/user/entities/user.entity';
import { CreateUserDto } from 'src/entities/user/dto/create-user.dto';
import { Admin } from './entities/admin.entity';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { generateHash } from 'src/utils/passwords';
import { FindAdminDto } from './dto/find-admin.dto';
import { JWTRequest } from 'src/auth/jwt/jwt.request';
import { deleteEmptyFields } from 'src/utils/data-transform';
import { USER_TYPE } from 'src/types/users.type';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Injectable()
export class AdminService {

  constructor(
    @InjectRepository(Admin) private readonly adminRepostory: Repository<Admin>,
    private dataSource: DataSource
  ) {}

  async create(createUserDto: CreateUserDto, createAdminDto: CreateAdminDto): Promise<HttpStatus> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let user: User = new User(createUserDto, USER_TYPE.ADMIN);
      createAdminDto.password = await generateHash(createAdminDto.password);
      let admin: Admin = new Admin(createAdminDto, user);
      await queryRunner.manager.save(user);
      await queryRunner.manager.save(admin);
      await queryRunner.commitTransaction();
      return HttpStatus.OK;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async update(req: JWTRequest, updateAdminDto: UpdateAdminDto, updateUserDto: UpdateUserDto): Promise<HttpStatus> {
    if (req.user.type != USER_TYPE.ADMIN) throw new UnauthorizedException();
    let admin: Admin = await this.findOne(req.user.entityid);
    if (!admin || admin.user.userid != req.user.userid) throw new UnauthorizedException();
    updateAdminDto = deleteEmptyFields(updateAdminDto);
    updateUserDto = deleteEmptyFields(updateUserDto);
    admin.updateData(updateAdminDto);
    admin.user.updateData(updateUserDto);
    this.adminRepostory.save(admin);
    return HttpStatus.OK;
  }

  // ADMINS 

  findAll(params: FindAdminDto): Promise<Admin[]> {
    let options: FindManyOptions<Admin> = { where: {...params}, relations: { user: true } };
    return this.adminRepostory.find(options);
  }

  findOne(id: number): Promise<Admin> {
    return this.adminRepostory.findOne({ where: { adminid: id }, relations: { user: true } });
  }

  async delete(id: number): Promise<HttpStatus> {
    let admin: Admin = await this.adminRepostory.findOne({ where: { adminid: id } });
    if (!admin) throw new NotFoundException();
    await this.adminRepostory.delete(id);
    return HttpStatus.OK;
  }
}
