import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { PicturesService } from './pictures/pictures.service';

describe('AppModule', () => {
  let picturesService: PicturesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PicturesService)
      .useValue({
        createPicture: jest.fn(),
        getAllPictures: jest.fn(),
        getFavorites: jest.fn(),
        toggleFavorite: jest.fn(),
      })
      .compile();

    expect(module).toBeDefined();
    picturesService = module.get<PicturesService>(PicturesService);
  });

  it('should compile the module', async () => {
    expect(picturesService).toBeDefined();
  });
});
