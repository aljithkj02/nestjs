import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  postImage(file){
    console.log(file);
    return 'image'
  }
}
