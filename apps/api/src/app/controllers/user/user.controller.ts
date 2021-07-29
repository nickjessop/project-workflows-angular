import { Controller, Post, Req } from '@nestjs/common';
import { FirebaseService } from '../../services/firebase/firebase.service';

@Controller('user')
export class UserController {
    constructor(private firebaseService: FirebaseService) {}

    @Post()
    updateUser(@Req() req: Request) {
        // req.locals
        // email: string, firstName: string, lastName: string, plan: UserPlan
        // res.locals.uid = uid;
        // this.firebaseService.updateUser({ id, email, firstName, lastName, plan });
    }
}
