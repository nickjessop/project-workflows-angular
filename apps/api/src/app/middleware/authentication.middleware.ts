import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { FirebaseService } from '../services/firebase/firebase.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    constructor(private firebaseService: FirebaseService) {}

    use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }

        const uid = this.firebaseService.fetchUid(authHeader);
        if (!uid) {
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }

        res.locals.uid = uid;

        next();
    }
}
