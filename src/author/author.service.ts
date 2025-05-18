import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthorService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  create(data: CreateAuthorDto) {
    return this.prisma.author.create({ data });
  }

  async findAll(query: any) {
    const { search, skip = 0, take = 10, sort = 'asc' } = query;

    const cacheKey = `authors-${search}-${skip}-${take}-${sort}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const authors = await this.prisma.author.findMany({
      where: search
        ? { name: { contains: search, mode: 'insensitive' } }
        : undefined,
      skip: Number(skip),
      take: Number(take),
      orderBy: { name: sort === 'desc' ? 'desc' : 'asc' },
    });

    await this.cacheManager.set(cacheKey, authors, 60);
    return authors;
  }

  async findOne(id: number) {
    const cacheKey = `author-${id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const author = await this.prisma.author.findUnique({ where: { id } });
    if (!author) throw new NotFoundException('Author not found');

    await this.cacheManager.set(cacheKey, author, 60);
    return author;
  }

  async update(id: number, data: UpdateAuthorDto) {
    await this.findOne(id); 
    await this.cacheManager.del(`author-${id}`);
    return this.prisma.author.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.cacheManager.del(`author-${id}`);
    return this.prisma.author.delete({ where: { id } });
  }
}
