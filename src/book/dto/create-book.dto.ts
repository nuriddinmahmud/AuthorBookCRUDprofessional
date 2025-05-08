import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  genre: string;

  @ApiProperty()
  @IsBoolean()
  published: boolean;

  @ApiProperty()
  @IsInt()
  authorId: number;
}
