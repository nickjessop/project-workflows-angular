import { Controller, HttpStatus, Post, Put, Req, Res } from '@nestjs/common';
import { FirebaseService } from '../../services/firebase/firebase.service';

@Controller('user')
export class UserController {
    constructor(private firebaseService: FirebaseService) {}

    @Put() async updateUser(@Req() req: any, @Res() res: any) {
        const uid = await res.locals.uid;

        // email: string, firstName: string, lastName: string, plan: UserPlan
        // res.locals.uid = uid;
        // this.firebaseService.updateUser({ id, email, firstName, lastName, plan });
        res.status(HttpStatus.OK).json({});
    }

    @Post() createUser(@Req() req: any, @Res() res: any) {
        // this.firebaseService

        res.status(HttpStatus.OK).json({});
    }
}
