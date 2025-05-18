import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';

@Module({
  imports: [
    CacheModule.register({ ttl: 60, max: 100 }), 
  ],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
