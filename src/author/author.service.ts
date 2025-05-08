import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateAuthorDto) {
    return this.prisma.author.create({ data });
  }

  async findAll(query: any) {
    const { search, skip = 0, take = 10, sort = 'asc' } = query;

    return this.prisma.author.findMany({
      where: search
        ? { name: { contains: search, mode: 'insensitive' } }
        : undefined,
      skip: Number(skip),
      take: Number(take),
      orderBy: { name: sort === 'desc' ? 'desc' : 'asc' },
    });
  }

  async findOne(id: number) {
    const author = await this.prisma.author.findUnique({ where: { id } });
    if (!author) throw new NotFoundException('Author not found');
    return author;
  }

  async update(id: number, data: UpdateAuthorDto) {
    await this.findOne(id); 
    return this.prisma.author.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id); 
    return this.prisma.author.delete({ where: { id } });
  }
}
