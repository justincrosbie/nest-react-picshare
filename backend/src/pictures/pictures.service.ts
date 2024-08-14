import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Picture } from './picture.entity';
import { Favorite } from './favourite.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PicturesService {
  private readonly logger = new Logger(PicturesService.name);

  constructor(
    @InjectRepository(Picture)
    private picturesRepository: Repository<Picture>,
    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) {}

  async createPicture(
    title: string,
    url: string,
    user: User,
  ): Promise<Picture> {
    const picture = this.picturesRepository.create({ title, url, user });
    return this.picturesRepository.save(picture);
  }

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

  async getAllPicturesWithUser(
    userId: number, // Add userId as a parameter
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

  async getFavorites(userId: number): Promise<Picture[]> {
    return this.picturesRepository
      .createQueryBuilder('picture')
      .innerJoin('picture.favorites', 'favorite')
      .where('favorite.user.id = :userId', { userId })
      .getMany();
  }

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
