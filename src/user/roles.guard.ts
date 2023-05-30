import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "./entities/role.enum";
import { User } from "./entities/user.entity";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles',[
            context.getHandler(),
            context.getClass()
        ]);

        if(!requiredRoles) return true;
        
        const user: User = {
            name: 'Aljith KJ',
            roles: [Role.ADMIN]
        }


        return requiredRoles.some(role => user.roles.includes(role));
    }
}