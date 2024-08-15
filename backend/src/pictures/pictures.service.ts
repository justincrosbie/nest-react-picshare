import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Picture } from './picture.entity';
import { Favorite } from './favourite.entity';
import { User } from '../users/user.entity';

/**
 * PicturesService handles the business logic related to pictures, including creation, retrieval, and favorite toggling.
 */
@Injectable()
export class PicturesService {
  private readonly logger = new Logger(PicturesService.name);

  /**
   * Constructs an instance of PicturesService.
   *
   * @param picturesRepository - The repository for managing Picture entities.
   * @param favoritesRepository - The repository for managing Favorite entities.
   */
  constructor(
    @InjectRepository(Picture)
    private picturesRepository: Repository<Picture>,
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) {}

  /**
   * Creates a new picture and saves it to the database.
   *
   * @param title - The title of the picture.
   * @param url - The URL of the picture.
   * @param user - The user associated with the picture.
   * @returns The newly created picture.
   */
  async createPicture(
    title: string,
    url: string,
    user: User,
  ): Promise<Picture> {
    const picture = this.picturesRepository.create({ title, url, user });
    return this.picturesRepository.save(picture);
  }

  /**
   * Retrieves all pictures with pagination, ordered by creation date in descending order.
   *
   * @param page - The page number to retrieve (default is 1).
   * @param limit - The number of pictures per page (default is 10).
   * @returns A tuple containing an array of pictures and the total count of pictures.
   */
  async getAllPictures(
    page: number = 1,
    limit: number = 10,
  ): Promise<[Picture[], number]> {
    return this.picturesRepository.findAndCount({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  /**
   * Retrieves all pictures with pagination and includes a flag indicating if each picture is a favorite of the specified user.
   *
   * @param userId - The ID of the user to check for favorites.
   * @param page - The page number to retrieve (default is 1).
   * @param limit - The number of pictures per page (default is 10).
   * @returns A tuple containing an array of pictures with a favorite flag and the total count of pictures.
   */
  async getAllPicturesWithUser(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<[Picture[], number]> {
    const [pictures, count] = await this.picturesRepository.findAndCount({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    const transformedPictures = await Promise.all(
      pictures.map(async (picture) => {
        const isFavorite = await this.favoritesRepository.findOne({
          where: { picture: { id: picture.id }, user: { id: userId } },
        });

        return {
          ...picture,
          isFavorite: !!isFavorite, // Convert the result to a boolean
        };
      }),
    );

    return [transformedPictures, count];
  }

  /**
   * Retrieves all pictures that the specified user has marked as favorites.
   *
   * @param userId - The ID of the user whose favorite pictures are to be retrieved.
   * @returns An array of the user's favorite pictures.
   */
  async getFavorites(userId: number): Promise<Picture[]> {
    return this.picturesRepository
      .createQueryBuilder('picture')
      .innerJoin('picture.favorites', 'favorite')
      .where('favorite.user.id = :userId', { userId })
      .getMany();
  }

  /**
   * Toggles the favorite status of a picture for a specified user.
   * If the picture is already a favorite, it is removed from the user's favorites.
   * If the picture is not a favorite, it is added to the user's favorites.
   *
   * @param pictureId - The ID of the picture to toggle.
   * @param userId - The ID of the user who is toggling the favorite status.
   * @throws NotFoundException if the picture is not found.
   */
  async toggleFavorite(pictureId: number, userId: number): Promise<void> {
    const picture = await this.picturesRepository.findOne({
      where: { id: pictureId },
    });
    if (!picture) {
      throw new NotFoundException('Picture not found');
    }

    const favorite = await this.favoritesRepository.findOne({
      where: { picture: { id: pictureId }, user: { id: userId } },
    });

    if (favorite) {
      await this.favoritesRepository.remove(favorite);
    } else {
      const newFavorite = this.favoritesRepository.create({
        picture: { id: pictureId },
        user: { id: userId },
      });
      await this.favoritesRepository.save(newFavorite);
    }
  }
}
