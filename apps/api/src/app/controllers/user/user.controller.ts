import { Controller, Post } from '@nestjs/common';
import { FirebaseService, UserPlan } from '../../services/firebase/firebase.service';

@Controller('user')
export class UserController {
    constructor(private firebaseService: FirebaseService) {}

    @Post()
    updateUser(user: User) {
        const { id, email, firstName, lastName, plan } = user;

        this.firebaseService.updateUser({ id, email, firstName, lastName, plan });
    }
}

interface User {
    id: string;
    email: string;
    emailVerified?: boolean;
    displayName: string;
    firstName: string;
    lastName: string;
    photoURL?: string;
    photoFilePath?: string;
    plan?: UserPlan;
}
