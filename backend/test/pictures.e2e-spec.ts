import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PicturesService } from 'src/pictures/pictures.service';
import { UsersService } from 'src/users/users.service';

describe('PicturesController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let authToken: string;
  let createdPictureId: number;

  let picturesService: PicturesService;
  let usersService: UsersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: +configService.get<number>('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        AppModule,
      ],
    })
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

    picturesService = moduleFixture.get<PicturesService>(PicturesService);
    usersService = moduleFixture.get<UsersService>(UsersService);

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    jwtService = app.get<JwtService>(JwtService);

    // Create a test user and generate a token
    const testUser = { id: 1, username: 'testuser' };
    authToken = jwtService.sign({
      username: testUser.username,
      sub: testUser.id,
    });
  });

  it('should compile the module', async () => {
    expect(picturesService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/pictures (POST)', () => {
    it('should create a new picture', async () => {
      const response = await request(app.getHttpServer())
        .post('/pictures')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Picture', url: 'http://test.com/image.jpg' })
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.title).toBe('Test Picture');
      expect(response.body.url).toBe('http://test.com/image.jpg');

      createdPictureId = response.body.id;
    });

    it('should fail to create a picture with invalid data', async () => {
      await request(app.getHttpServer())
        .post('/pictures')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: '', url: 'invalid-url' })
        .expect(400);
    });

    it('should fail to create a picture without authentication', async () => {
      await request(app.getHttpServer())
        .post('/pictures')
        .send({ title: 'Test Picture', url: 'http://test.com/image.jpg' })
        .expect(401);
    });
  });

  describe('/pictures (GET)', () => {
    it('should return a list of pictures', async () => {
      const response = await request(app.getHttpServer())
        .get('/pictures')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return paginated results', async () => {
      const response = await request(app.getHttpServer())
        .get('/pictures?page=1&limit=5')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should fail to get pictures without authentication', async () => {
      await request(app.getHttpServer()).get('/pictures').expect(401);
    });
  });

  describe('/pictures/favorites (GET)', () => {
    it("should return user's favorite pictures", async () => {
      const response = await request(app.getHttpServer())
        .get('/pictures/favorites')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should fail to get favorites without authentication', async () => {
      await request(app.getHttpServer()).get('/pictures/favorites').expect(401);
    });
  });

  describe('/pictures/:id/favorite (POST)', () => {
    it('should toggle favorite status of a picture', async () => {
      // First, favorite the picture
      await request(app.getHttpServer())
        .post(`/pictures/${createdPictureId}/favorite`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201)
        .expect((res) => {
          expect(res.body.message).toBe('Favorite toggled successfully');
        });

      // Check if the picture is in favorites
      let favoritesResponse = await request(app.getHttpServer())
        .get('/pictures/favorites')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(
        favoritesResponse.body.some((pic) => pic.id === createdPictureId),
      ).toBe(true);

      // Now, unfavorite the picture
      await request(app.getHttpServer())
        .post(`/pictures/${createdPictureId}/favorite`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201)
        .expect((res) => {
          expect(res.body.message).toBe('Favorite toggled successfully');
        });

      // Check if the picture is removed from favorites
      favoritesResponse = await request(app.getHttpServer())
        .get('/pictures/favorites')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(
        favoritesResponse.body.some((pic) => pic.id === createdPictureId),
      ).toBe(false);
    });

    it('should fail to toggle favorite for non-existent picture', async () => {
      await request(app.getHttpServer())
        .post('/pictures/99999/favorite')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should fail to toggle favorite without authentication', async () => {
      await request(app.getHttpServer())
        .post(`/pictures/${createdPictureId}/favorite`)
        .expect(401);
    });
  });

  describe('Error handling', () => {
    it('should handle invalid picture ID format', async () => {
      await request(app.getHttpServer())
        .post('/pictures/invalid-id/favorite')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });

    it('should handle invalid JWT token', async () => {
      await request(app.getHttpServer())
        .get('/pictures')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should handle missing Authorization header', async () => {
      await request(app.getHttpServer()).get('/pictures').expect(401);
    });
  });
});
