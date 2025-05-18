import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { BookService } from './book.service';
import { BookController } from './book.controller';

@Module({
  imports: [
    CacheModule.register({ ttl: 60, max: 100 }), 
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
