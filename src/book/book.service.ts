import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class BookService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  create(data: CreateBookDto) {
    return this.prisma.book.create({ data, include: { author: true } });
  }

  async findAll(query: any) {
    const {
      genre,
      published,
      authorId,
      skip = 0,
      take = 10,
      sort = 'asc',
    } = query;

    const cacheKey = `books-${genre}-${published}-${authorId}-${skip}-${take}-${sort}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const books = await this.prisma.book.findMany({
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

    await this.cacheManager.set(cacheKey, books, 60); 
    return books;
  }

  async findOne(id: number) {
    const cacheKey = `book-${id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');

    await this.cacheManager.set(cacheKey, book, 60);
    return book;
  }

  async update(id: number, data: UpdateBookDto) {
    await this.findOne(id); 
    await this.cacheManager.del(`book-${id}`);
    return this.prisma.book.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.cacheManager.del(`book-${id}`);
    return this.prisma.book.delete({ where: { id } });
  }
}
