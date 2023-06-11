import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable() 
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User> 
  ){}


  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async findAll() {
    return await this.userRepository.find(); 
  }

  async findOne(id) {
    const user = await this.userRepository.findOne({ where: { id }});
    if(user){
      return user;
    }
    throw new NotFoundException('No such user');
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.update(id, updateUserDto);
    if(user.affected){
      return user;
    }

    throw new NotFoundException('No such user exist !!')
  }

  async remove(id: number) {
    const user = await this.userRepository.delete(id);
    if(user.affected){
      return user;
    }

    throw new NotFoundException('No such user exist !!')
  }
}
