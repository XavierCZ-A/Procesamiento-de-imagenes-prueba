import { PartialType } from '@nestjs/mapped-types';
import { CreateImageResourceDto } from './create-image-resource.dto';

export class UpdateImageResourceDto extends PartialType(CreateImageResourceDto) {}
