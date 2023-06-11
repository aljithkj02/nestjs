import { IsAlpha, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsAlpha()
    @IsNotEmpty()
    name: string;
}
