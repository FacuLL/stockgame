import { Injectable } from '@nestjs/common';
import { CreateBasicuserDto } from './dto/create-basicuser.dto';
import { UpdateBasicuserDto } from './dto/update-basicuser.dto';

@Injectable()
export class BasicuserService {
  create(createBasicuserDto: CreateBasicuserDto) {
    return 'This action adds a new basicuser';
  }

  findAll() {
    return `This action returns all basicuser`;
  }

  findOne(id: number) {
    return `This action returns a #${id} basicuser`;
  }

  update(id: number, updateBasicuserDto: UpdateBasicuserDto) {
    return `This action updates a #${id} basicuser`;
  }

  remove(id: number) {
    return `This action removes a #${id} basicuser`;
  }
}
