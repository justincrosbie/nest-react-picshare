import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Logger,
  ParseIntPipe,
} from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { AuthGuard } from '../auth/auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { CreatePictureDto } from './dto/create-picture.dto';
import { GetPicturesDto } from './dto/get-pictures.dto';
import { JwtPayload } from '../auth/dto/jwt-payload';
import { UsersService } from '../users/users.service';

@Controller('pictures')
@UseGuards(AuthGuard)
export class PicturesController {
  private readonly logger = new Logger(PicturesController.name);

  constructor(
    private readonly picturesService: PicturesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async createPicture(
    @Body() createPictureDto: CreatePictureDto,
    @GetUser() jwtPayload: JwtPayload,
  ) {
    const user = await this.usersService.findById(jwtPayload.sub);

    return this.picturesService.createPicture(
      createPictureDto.title,
      createPictureDto.url,
      user,
    );
  }

  @Get()
  async getAllPictures(@Query() getPicturesDto: GetPicturesDto) {
    const { page = 1, limit = 10 } = getPicturesDto;
    return this.picturesService.getAllPictures(page, limit);
  }

  @Get('favorites')
  async getFavorites(@GetUser() jwtPayload: JwtPayload) {
    return this.picturesService.getFavorites(jwtPayload.sub);
  }

  @Post(':id/favorite')
  async toggleFavorite(
    @Param('id', ParseIntPipe) id: string,
    @GetUser() jwtPayload: JwtPayload,
  ) {
    await this.picturesService.toggleFavorite(+id, jwtPayload.sub);
    return { message: 'Favorite toggled successfully' };
  }
}
