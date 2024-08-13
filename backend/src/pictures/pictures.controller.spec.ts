import { Test, TestingModule } from '@nestjs/testing';
import { PicturesController } from './pictures.controller';
import { PicturesService } from './pictures.service';
import { UsersService } from '../users/users.service'; // Add this import
import { User } from '../users/user.entity';
import { CreatePictureDto } from './dto/create-picture.dto';
import { GetPicturesDto } from './dto/get-pictures.dto';
import { AuthGuard } from '../auth/auth.guard';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Picture } from './picture.entity';
import { JwtPayload } from 'src/auth/dto/jwt-payload';

// Mock AuthGuard
class MockAuthGuard {
  canActivate() {
    return true;
  }
}

describe('PicturesController', () => {
  let controller: PicturesController;
  let service: PicturesService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PicturesController],
      providers: [
        {
          provide: PicturesService,
          useValue: {
            createPicture: jest.fn(),
            getAllPictures: jest.fn(),
            getFavorites: jest.fn(),
            toggleFavorite: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            // Add any methods from UsersService that PicturesController uses
            findById: jest.fn(),
            // Add more methods as needed
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    controller = module.get<PicturesController>(PicturesController);
    service = module.get<PicturesService>(PicturesService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPicture', () => {
    it('should create a picture', async () => {
      const createPictureDto: CreatePictureDto = {
        title: 'Test Picture',
        url: 'http://test.com',
      };
      const jwtPayload: JwtPayload = {
        sub: 1,
        username: 'testuser',
      } as JwtPayload;

      const user: User = {
        id: 1,
        username: 'testuser',
        email: '',
      } as unknown as User;

      const createdPicture: Picture = {
        id: 1,
        ...createPictureDto,
      } as Picture;

      jest.spyOn(service, 'createPicture').mockResolvedValue(createdPicture);
      jest.spyOn(usersService, 'findById').mockResolvedValue(user);

      const result = await controller.createPicture(
        createPictureDto,
        jwtPayload,
      );

      expect(result).toEqual(createdPicture);
      expect(usersService.findById).toHaveBeenCalledWith(jwtPayload.sub);

      expect(service.createPicture).toHaveBeenCalledWith(
        createPictureDto.title,
        createPictureDto.url,
        user,
      );
    });

    it('should throw BadRequestException if service throws', async () => {
      const createPictureDto: CreatePictureDto = {
        title: 'Test Picture',
        url: 'http://test.com',
      };
      const jwtPayload: JwtPayload = {
        sub: 1,
        username: 'testuser',
      } as JwtPayload;

      jest
        .spyOn(service, 'createPicture')
        .mockRejectedValue(new BadRequestException());

      await expect(
        controller.createPicture(createPictureDto, jwtPayload),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAllPictures', () => {
    it('should return all pictures with default pagination', async () => {
      const getPicturesDto: GetPicturesDto = {};
      const pictures: Picture[] = [
        {
          id: 1,
          title: 'Test Picture',
          url: 'http://test.com',
          user: {} as User,
        },
      ] as Picture[];
      const expectedResult: [Picture[], number] = [pictures, 1];

      jest.spyOn(service, 'getAllPictures').mockResolvedValue(expectedResult);

      const result = await controller.getAllPictures(getPicturesDto);

      expect(result).toEqual(expectedResult);
      expect(service.getAllPictures).toHaveBeenCalledWith(1, 10);
    });

    it('should return all pictures with custom pagination', async () => {
      const getPicturesDto: GetPicturesDto = { page: 2, limit: 20 };
      const pictures: Picture[] = [
        {
          id: 1,
          title: 'Test Picture',
          url: 'http://test.com',
          user: {} as User,
        },
      ] as Picture[];
      const expectedResult: [Picture[], number] = [pictures, 1];

      jest.spyOn(service, 'getAllPictures').mockResolvedValue(expectedResult);

      const result = await controller.getAllPictures(getPicturesDto);

      expect(result).toEqual(expectedResult);
      expect(service.getAllPictures).toHaveBeenCalledWith(2, 20);
    });
  });

  describe('getFavorites', () => {
    it('should return favorite pictures', async () => {
      const jwtPayload: JwtPayload = {
        sub: 1,
        username: 'testuser',
      } as JwtPayload;

      const favorites: Picture[] = [
        {
          id: 1,
          title: 'Favorite Picture',
          url: 'http://favorite.com',
          user: {} as User,
        },
      ] as Picture[];

      jest.spyOn(service, 'getFavorites').mockResolvedValue(favorites);

      const result = await controller.getFavorites(jwtPayload);

      expect(result).toEqual(favorites);
      expect(service.getFavorites).toHaveBeenCalledWith(jwtPayload.sub);
    });
  });

  describe('toggleFavorite', () => {
    it('should toggle favorite status', async () => {
      const jwtPayload: JwtPayload = {
        sub: 1,
        username: 'testuser',
      } as JwtPayload;

      const pictureId = '1'; // Changed to string to match controller input type

      jest.spyOn(service, 'toggleFavorite').mockResolvedValue(undefined);

      const result = await controller.toggleFavorite(pictureId, jwtPayload);

      expect(result).toEqual({ message: 'Favorite toggled successfully' });
      expect(service.toggleFavorite).toHaveBeenCalledWith(1, jwtPayload.sub); // Service method still expects a number
    });

    it('should throw NotFoundException if service throws', async () => {
      const jwtPayload: JwtPayload = {
        sub: 1,
        username: 'testuser',
      } as JwtPayload;
      const pictureId = '1'; // Changed to string

      jest
        .spyOn(service, 'toggleFavorite')
        .mockRejectedValue(new NotFoundException('Picture not found'));

      await expect(
        controller.toggleFavorite(pictureId, jwtPayload),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
