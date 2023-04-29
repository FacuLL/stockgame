import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { Repository } from 'typeorm';
import { FindPlanDto } from './dto/find-plan.dto';

@Injectable()
export class PlanService {

  constructor(
    @InjectRepository(Plan) private readonly planRepostory: Repository<Plan>
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<HttpStatus> {
    let plan: Plan = new Plan(createPlanDto);
    await this.planRepostory.save(plan);
    return HttpStatus.OK;
  }

  findAll(params: FindPlanDto): Promise<Plan[]> {
    return this.planRepostory.find({ where: { ...params } });
  }

  findOne(id: number): Promise<Plan> {
    return this.planRepostory.findOne({ where: { planid: id }, relations: { institutions: true } });
  }

  async update(id: number, updatePlanDto: UpdatePlanDto): Promise<HttpStatus> {
    let plan: Plan = await this.findOne(id);
    if (!plan) throw new NotFoundException();
    plan.updateData(updatePlanDto);
    await this.planRepostory.save(plan);
    return HttpStatus.OK;
  }

  async delete(id: number): Promise<HttpStatus> {
    let plan: Plan = await this.findOne(id);
    if (!plan) throw new NotFoundException();
    await this.planRepostory.delete(id);
    return HttpStatus.OK;
  }
}
