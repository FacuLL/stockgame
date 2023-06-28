import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, Query } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { AdminJWTAuthGuard } from 'src/auth/admin-jwt/admin-jwt.guard';
import { Plan } from './entities/plan.entity';
import { Public } from 'src/auth/public/public.decorator';
import { FindPlanDto } from './dto/find-plan.dto';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @UseGuards(AdminJWTAuthGuard)
  @Post()
  create(@Body() createPlanDto: CreatePlanDto): Promise<HttpStatus> {
    return this.planService.create(createPlanDto);
  }

  @Public()
  @Get()
  findAll(@Query() params: FindPlanDto): Promise<Plan[]> {
    return this.planService.findAll(params);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Plan> {
    return this.planService.findOne(+id);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(+id, updatePlanDto);
  }

  @UseGuards(AdminJWTAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planService.delete(+id);
  }
}
