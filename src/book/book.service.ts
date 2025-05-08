import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateBookDto) {
    return this.prisma.book.create({ data, include: { author: true } });
  }

  findAll(query: any) {
    const {
      genre,
      published,
      authorId,
      skip = 0,
      take = 10,
      sort = 'asc',
    } = query;

    return this.prisma.book.findMany({
      where: {
        ...(genre && { genre }),
        ...(published !== undefined && { published: published === 'true' }),
        ...(authorId && { authorId: Number(authorId) }),
      },
      skip: Number(skip),
      take: Number(take),
      orderBy: { title: sort === 'desc' ? 'desc' : 'asc' },
      include: { author: true },
    });
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: number, data: UpdateBookDto) {
    await this.findOne(id);
    return this.prisma.book.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }
}
