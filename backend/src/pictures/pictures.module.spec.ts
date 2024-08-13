import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PicturesModule } from './pictures.module';
import { PicturesService } from './pictures.service';
import { Picture } from './picture.entity';
import { Favorite } from './favourite.entity';
import { UsersService } from '../users/users.service';
import { AuthModule } from '../auth/auth.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

describe('PicturesModule', () => {
  let picturesService: PicturesService;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        PicturesModule,
        TypeOrmModule.forFeature([Picture, Favorite]),
        AuthModule,
      ],
    })
      .overrideProvider(getRepositoryToken(Picture))
      .useValue({})
      .overrideProvider(getRepositoryToken(Favorite))
      .useValue({})
      .overrideProvider(getRepositoryToken(User))
      .useValue({})
      .overrideProvider(PicturesService)
      .useValue({
        createPicture: jest.fn(),
        getAllPictures: jest.fn(),
        getFavorites: jest.fn(),
        toggleFavorite: jest.fn(),
      })
      .overrideProvider(UsersService)
      .useValue({
        findById: jest.fn(),
      })
      .compile();

    picturesService = moduleRef.get<PicturesService>(PicturesService);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  it('should compile the module', async () => {
    expect(picturesService).toBeDefined();
    expect(usersService).toBeDefined();
  });
});
