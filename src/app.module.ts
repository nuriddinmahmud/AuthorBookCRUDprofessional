import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager'; 
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller'; 
import { AppService } from './app.service'; 

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true, 
      ttl: 60,        
      max: 100,       
    }),
    PrismaModule,
    AuthorModule,
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
