import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Picture } from './picture.entity';
import { Favorite } from './favourite.entity';
import { PicturesService } from './pictures.service';
import { PicturesController } from './pictures.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Picture, Favorite]),
    AuthModule,
    UsersModule,
  ],
  providers: [PicturesService],
  controllers: [PicturesController],
})
export class PicturesModule {}
