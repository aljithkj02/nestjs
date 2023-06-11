import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../src/users/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  const mockUsers = [ { id: 1, name: "Aljith"} ]

  const mockUserRepository = {
    find: jest.fn().mockResolvedValue(mockUsers),
    create: jest.fn(dto => dto),
    save: jest.fn((dto) => {
        return {
            id: Date.now(),
            name: dto.name
        }
    })
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).overrideProvider(getRepositoryToken(User)).useValue(mockUserRepository).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/users (GET)', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(mockUsers);
  });

  it('/users (POSTS)', () => {
    return request(app.getHttpServer())
    .post('/users')
    .send({ name: 'Neymar'})
    .expect('Content-Type', /json/)
    .expect(201)
    .then(res => {
        expect(res.body).toEqual({
            id: expect.any(Number),
            name: 'Neymar'
        })
    }) 
  })

  it('/users (POSTS) --> 400 on validation error', () => {
    return request(app.getHttpServer())
    .post('/users')
    .send({ name: 'Neymar jr'})
    .expect(400)
    .expect({
        "statusCode": 400,
        "message": [
            "name must contain only letters (a-zA-Z)"
        ],
        "error": "Bad Request"
    })
  })
});
