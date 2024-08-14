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
import { GetUserId } from '../auth/get-userid.decorator';
import { CreatePictureDto } from './dto/create-picture.dto';
import { GetPicturesDto } from './dto/get-pictures.dto';
import { UsersService } from '../users/users.service';

@Controller('pictures')
export class PicturesController {
  private readonly logger = new Logger(PicturesController.name);

  constructor(
    private readonly picturesService: PicturesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createPicture(
    @Body() createPictureDto: CreatePictureDto,
    @GetUserId() userId: number,
  ) {
    const user = await this.usersService.findById(userId);

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

  @Get('secure')
  @UseGuards(AuthGuard)
  async getAllPicturesSecure(
    @GetUserId() userId: number,
    @Query() getPicturesDto: GetPicturesDto,
  ) {
    const { page = 1, limit = 10 } = getPicturesDto;
    return this.picturesService.getAllPicturesWithUser(+userId, page, limit);
  }

  @Get('favorites')
  @UseGuards(AuthGuard)
  async getFavorites(@GetUserId() userId: number) {
    return this.picturesService.getFavorites(userId);
  }

  @Post(':id/favorite')
  @UseGuards(AuthGuard)
  async toggleFavorite(
    @Param('id', ParseIntPipe) id: string,
    @GetUserId() userId: number,
  ) {
    await this.picturesService.toggleFavorite(+id, userId);
    return { message: 'Favorite toggled successfully' };
  }
}
