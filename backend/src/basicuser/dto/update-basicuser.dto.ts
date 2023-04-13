import { PartialType } from '@nestjs/mapped-types';
import { CreateBasicuserDto } from './create-basicuser.dto';

export class UpdateBasicuserDto extends PartialType(CreateBasicuserDto) {}
