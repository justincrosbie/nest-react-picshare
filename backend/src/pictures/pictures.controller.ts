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
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Picture } from './picture.entity';

@ApiTags('pictures')
@Controller('pictures')
export class PicturesController {
  private readonly logger = new Logger(PicturesController.name);

  constructor(
    private readonly picturesService: PicturesService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Creates a new picture.
   * @param createPictureDto - The DTO containing the title and URL of the picture.
   * @param userId - The ID of the authenticated user creating the picture.
   * @returns The created picture.
   */
  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new picture' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'The picture has been successfully created.',
    type: Picture,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createPicture(
    @Body() createPictureDto: CreatePictureDto,
    @GetUserId() userId: number,
  ): Promise<Picture> {
    const user = await this.usersService.findById(userId);
    return this.picturesService.createPicture(
      createPictureDto.title,
      createPictureDto.url,
      user,
    );
  }

  /**
   * Retrieves all pictures with pagination.
   * @param getPicturesDto - The DTO containing pagination options.
   * @returns A paginated list of pictures.
   */
  @Get()
  @ApiOperation({ summary: 'Get all pictures with pagination' })
  @ApiResponse({
    status: 200,
    description: 'The list of pictures.',
    type: [Picture],
  })
  async getAllPictures(
    @Query() getPicturesDto: GetPicturesDto,
  ): Promise<[Picture[], number]> {
    const { page = 1, limit = 10 } = getPicturesDto;
    return this.picturesService.getAllPictures(page, limit);
  }

  /**
   * Retrieves pictures associated with the authenticated user, with pagination.
   * @param userId - The ID of the authenticated user.
   * @param getPicturesDto - The DTO containing pagination options.
   * @returns A paginated list of pictures associated with the user.
   */
  @Get('secure')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get pictures for the authenticated user with pagination',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The list of pictures for the user.',
    type: [Picture],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAllPicturesSecure(
    @GetUserId() userId: number,
    @Query() getPicturesDto: GetPicturesDto,
  ): Promise<[Picture[], number]> {
    const { page = 1, limit = 10 } = getPicturesDto;
    return this.picturesService.getAllPicturesWithUser(userId, page, limit);
  }

  /**
   * Retrieves all favorite pictures of the authenticated user.
   * @param userId - The ID of the authenticated user.
   * @returns A list of favorite pictures for the user.
   */
  @Get('favorites')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get favorite pictures of the authenticated user' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'The list of favorite pictures for the user.',
    type: [Picture],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getFavorites(@GetUserId() userId: number): Promise<Picture[]> {
    return this.picturesService.getFavorites(userId);
  }

  /**
   * Toggles the favorite status of a picture for the authenticated user.
   * @param id - The ID of the picture to toggle favorite status.
   * @param userId - The ID of the authenticated user.
   * @returns A confirmation message.
   */
  @Post(':id/favorite')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Toggle favorite status for a picture' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Favorite toggled successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async toggleFavorite(
    @Param('id', ParseIntPipe) id: number,
    @GetUserId() userId: number,
  ): Promise<{ message: string }> {
    await this.picturesService.toggleFavorite(id, userId);
    return { message: 'Favorite toggled successfully' };
  }
}
