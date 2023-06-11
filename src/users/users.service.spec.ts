import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService; 

  const mockUserRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(user => {
      return Promise.resolve({
        id: Date.now(),
        ...user
      })
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create user', () => {
    it('should create a user and return that', async () => {
      const dto = {
        name: 'Ronaldo'
      }

      expect(await service.create(dto)).toEqual({
        id: expect.any(Number),
        name: dto.name
      })
    })
  })
});
