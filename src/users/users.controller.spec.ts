import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(dto => {
      return {
        id: Date.now(),
        ...dto
      }
    }),
    update: jest.fn((id, dto) => {
      return {
        id: +id,
        ...dto
      }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
    .overrideProvider(UsersService)
    .useValue(mockUsersService)
    .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    const dto = { name: 'Messi' };
    expect(controller.create(dto)).toEqual({
      id: expect.any(Number),
      name: dto.name
    })

    expect(mockUsersService.create).toHaveBeenCalledWith(dto);
  })

  it('should update user', () => {
    const dto = {
      name: 'Messi'
    }

    expect(mockUsersService.update('2', dto)).toEqual({
      id: 2,
      ...dto
    })

    expect(mockUsersService.update).toHaveBeenCalled();
  })
});
