import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { generateHash } from 'src/utils/passwords';
import { Institution } from './entities/institution.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { JWTRequest } from 'src/auth/jwt/jwt.request';
import { deleteEmptyFields } from 'src/utils/data-transform';

@Injectable()
export class InstitutionService {

  constructor(
    @InjectRepository(Institution) private readonly institutionRepostory: Repository<Institution>,
    private dataSource: DataSource
  ) {}

  async create(createUserDto: CreateUserDto, createInstitutionDto: CreateInstitutionDto): Promise<HttpStatus> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let user: User = new User(createUserDto, "institution");
      createInstitutionDto.password = await generateHash(createInstitutionDto.password);
      let institution: Institution = new Institution(createInstitutionDto, user);
      await queryRunner.manager.save(user);
      await queryRunner.manager.save(institution);
      await queryRunner.commitTransaction();
      return HttpStatus.OK;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(e.message, e.status);
    } finally {
      await queryRunner.release();
    }
  }

  findAll(params: FindOptionsWhere<Institution>): Promise<Institution[]> {
    let options: FindManyOptions<Institution> = {where: {...params}, relations: {user: true}};
    return this.institutionRepostory.find(options);
  }

  findOne(id: number): Promise<Institution> {
    return this.institutionRepostory.findOne({where: {institutionid: id}, relations: {user: true, users: true, games: true, ownergames: true}})
  }

  async update(req: JWTRequest, updateInstitutionDto: UpdateInstitutionDto): Promise<HttpStatus> {
    if (req.user.type != "institution") throw new UnauthorizedException();
    let institution: Institution = await this.findOne(req.user.entityid);
    if (!institution || institution.user.userid != req.user.userid) throw new UnauthorizedException();
    updateInstitutionDto = deleteEmptyFields(updateInstitutionDto);
    institution.updateData(updateInstitutionDto);
    return HttpStatus.OK;
  }

  async delete(id: number): Promise<HttpStatus> {
    let institution: Institution = await this.institutionRepostory.findOne({ where: { institutionid: id } });
    if (institution) throw new NotFoundException();
    await this.institutionRepostory.delete(id);
    return HttpStatus.OK;
  }
}
