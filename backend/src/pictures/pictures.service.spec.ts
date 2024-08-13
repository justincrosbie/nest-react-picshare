// src/pictures/pictures.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PicturesService } from './pictures.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Picture } from './picture.entity';
import { Favorite } from './favourite.entity';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('PicturesService', () => {
  let service: PicturesService;
  let pictureRepo: Repository<Picture>;
  let favoriteRepo: Repository<Favorite>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PicturesService,
        {
          provide: getRepositoryToken(Picture),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              innerJoin: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
            })),
          },
        },
        {
          provide: getRepositoryToken(Favorite),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PicturesService>(PicturesService);
    pictureRepo = module.get<Repository<Picture>>(getRepositoryToken(Picture));
    favoriteRepo = module.get<Repository<Favorite>>(
      getRepositoryToken(Favorite),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPicture', () => {
    it('should successfully create a picture', async () => {
      const user = { id: 1, username: 'testuser' } as User;
      const newPicture = {
        id: 1,
        title: 'Test Picture',
        url: 'http://test.com',
        user,
      } as Picture;

      jest.spyOn(pictureRepo, 'create').mockReturnValue(newPicture);
      jest.spyOn(pictureRepo, 'save').mockResolvedValue(newPicture);

      const result = await service.createPicture(
        'Test Picture',
        'http://test.com',
        user,
      );

      expect(result).toEqual(newPicture);
      expect(pictureRepo.create).toHaveBeenCalledWith({
        title: 'Test Picture',
        url: 'http://test.com',
        user,
      });
      expect(pictureRepo.save).toHaveBeenCalledWith(newPicture);
    });
  });

  describe('getAllPictures', () => {
    it('should return an array of pictures and count', async () => {
      const pictures = [
        { id: 1, title: 'Test Picture', url: 'http://test.com' },
      ] as Picture[];
      jest.spyOn(pictureRepo, 'findAndCount').mockResolvedValue([pictures, 1]);

      const result = await service.getAllPictures();

      expect(result).toEqual([pictures, 1]);
      expect(pictureRepo.findAndCount).toHaveBeenCalledWith({
        relations: ['user', 'favorites'],
        order: { createdAt: 'DESC' },
        take: 10,
        skip: 0,
      });
    });

    it('should handle pagination correctly', async () => {
      const pictures = [
        { id: 1, title: 'Test Picture', url: 'http://test.com' },
      ] as Picture[];
      jest.spyOn(pictureRepo, 'findAndCount').mockResolvedValue([pictures, 1]);

      await service.getAllPictures(2, 20);

      expect(pictureRepo.findAndCount).toHaveBeenCalledWith({
        relations: ['user', 'favorites'],
        order: { createdAt: 'DESC' },
        take: 20,
        skip: 20,
      });
    });
  });

  describe('getFavorites', () => {
    it('should return favorite pictures for a user', async () => {
      const favorites = [
        { id: 1, title: 'Favorite Picture', url: 'http://favorite.com' },
      ] as Picture[];
      const queryBuilder = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(favorites),
      };
      jest
        .spyOn(pictureRepo, 'createQueryBuilder')
        .mockReturnValue(queryBuilder as any);

      const result = await service.getFavorites(1);

      expect(result).toEqual(favorites);
      expect(pictureRepo.createQueryBuilder).toHaveBeenCalledWith('picture');
      expect(queryBuilder.innerJoin).toHaveBeenCalledWith(
        'picture.favorites',
        'favorite',
      );
      expect(queryBuilder.where).toHaveBeenCalledWith(
        'favorite.user.id = :userId',
        { userId: 1 },
      );
    });

    it('should return an empty array if user has no favorites', async () => {
      const queryBuilder = {
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      jest
        .spyOn(pictureRepo, 'createQueryBuilder')
        .mockReturnValue(queryBuilder as any);

      const result = await service.getFavorites(1);

      expect(result).toEqual([]);
    });
  });

  describe('toggleFavorite', () => {
    it('should add a favorite if it does not exist', async () => {
      const picture = { id: 1 } as Picture;
      const favorite = { id: 1, picture, user: { id: 1 } } as Favorite;

      jest.spyOn(pictureRepo, 'findOne').mockResolvedValue(picture);
      jest.spyOn(favoriteRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(favoriteRepo, 'create').mockReturnValue(favorite);
      jest.spyOn(favoriteRepo, 'save').mockResolvedValue(favorite);

      await service.toggleFavorite(1, 1);

      expect(favoriteRepo.create).toHaveBeenCalledWith({
        picture: { id: 1 },
        user: { id: 1 },
      });
      expect(favoriteRepo.save).toHaveBeenCalledWith(favorite);
    });

    it('should remove a favorite if it exists', async () => {
      const picture = { id: 1 } as Picture;
      const favorite = { id: 1, picture, user: { id: 1 } } as Favorite;

      jest.spyOn(pictureRepo, 'findOne').mockResolvedValue(picture);
      jest.spyOn(favoriteRepo, 'findOne').mockResolvedValue(favorite);
      jest.spyOn(favoriteRepo, 'remove').mockResolvedValue(favorite);

      await service.toggleFavorite(1, 1);

      expect(favoriteRepo.remove).toHaveBeenCalledWith(favorite);
    });

    it('should throw NotFoundException if picture does not exist', async () => {
      jest.spyOn(pictureRepo, 'findOne').mockResolvedValue(null);

      await expect(service.toggleFavorite(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
