import { HttpException, Injectable } from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { generateHash } from 'src/utils/passwords';
import { Institution } from './entities/institution.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class InstitutionService {

  constructor(
    @InjectRepository(Institution) private readonly institutionRepostory: Repository<Institution>,
    private dataSource: DataSource
  ) {}

  async create(createUserDto: CreateUserDto, createInstitutionDto: CreateInstitutionDto) {
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

  update(req: Request, updateInstitutionDto: UpdateInstitutionDto) {
    
  }

  remove(id: number) {
    return `This action removes a #${id} institution`;
  }
}
