import { Body, Controller, HttpStatus, Post, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserDTO } from '@stepflow/interfaces';
import { FirebaseService } from '../../services/firebase/firebase.service';

@Controller('user')
export class UserController {
    constructor(private firebaseService: FirebaseService) {}

    @Put()
    @UseInterceptors(FileInterceptor('photo'))
    async updateUser(@UploadedFile() file: File, @Res() res: any, @Req() req: any, @Body() body: UserDTO) {
        const test = body;
        const uid = await res.locals.uid;

        const shouldUploadNewPhoto = !!file;

        if (shouldUploadNewPhoto) {
            const test = await this.firebaseService.uploadUserPhoto(uid, file);
        }

        // TODO:
        // 1. Upload profile icon if any
        // 2. Update user's builtin firebase profile using updateProfile()
        // 3. Update our firestore collection USER_COLLECTION_NAME for profile data

        // if (shouldUploadNewPhoto) {
        //     // Delete old photo if any
        //     const res = await this.firebaseService.deleteUserPhoto(photoFilePath);

        //     const test = await this.firebaseService.uploadUserPhoto(uid, profileFormData);

        //     debugger;

        // Upload new photo
        // }

        // Check to upload new photo

        // upload new photo if any

        // update user's updateUserMetaData

        // return new user

        // email: string, firstName: string, lastName: string, plan: UserPlan
        // res.locals.uid = uid;
        // this.firebaseService.updateUser({ id, email, firstName, lastName, plan });
        // console.log(body);
        res.status(HttpStatus.OK).json({});
    }

    @Post() createUser(@Req() req: any, @Res() res: any) {
        // this.firebaseService

        res.status(HttpStatus.OK).json({});
    }
}
