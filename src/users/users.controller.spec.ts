import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    data: [{id: 1, name: 'Aljith'}, { id: 2, name: 'Jithu'}],
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
    }),
    findOne: jest.fn(function(id){
      id = +id;
      if(id >= this.data.length) throw new NotFoundException('No such user');
      return this.data[id];
    }),
    remove: jest.fn(function(id){
      id = +id;
      if(id >= this.data.length) throw new NotFoundException('No such user');
      const deletedData = this.data.splice(id, 1);
      return deletedData[0];
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

  it('should throw an error', () => {
    const findOne = () => {
      return controller.findOne('2');
    }
    expect(findOne).toThrowError();
  })

  it('should return a user', () => {
    expect(controller.findOne('1')).toEqual(mockUsersService.data[1]);
  })

  it('should remove a user', () => {
    expect(controller.remove('1')).toEqual({id: 2, name: 'Jithu'});

    expect(mockUsersService.data).toHaveLength(1);
  })
});
