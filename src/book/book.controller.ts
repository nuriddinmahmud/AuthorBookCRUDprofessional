import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Book')
@Controller('books')
@UseInterceptors(CacheInterceptor) 
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiQuery({ name: 'genre', required: false })
  @ApiQuery({ name: 'authorId', required: false })
  @ApiQuery({ name: 'published', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'sort', enum: ['asc', 'desc'], required: false })
  findAll(
    @Query('genre') genre?: string,
    @Query('authorId') authorId?: string,
    @Query('published') published?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('sort') sort?: string,
  ) {
    return this.bookService.findAll({
      genre,
      authorId,
      published,
      skip,
      take,
      sort,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.bookService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(+id);
  }
}
