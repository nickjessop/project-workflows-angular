import { Controller, Delete, Get, Patch, Post, Req, Res } from '@nestjs/common';
import { FirebaseService } from '../../services/firebase.service';

@Controller('block')
export class BlockController {
    constructor(private firebaseService: FirebaseService) {}

    @Post()
    createBlock(@Req() req: any, @Res() res: any) {}

    @Get()
    getBlock() {
        return 'Get block';
    }

    @Get(':id')
    getBlockById() {
        return 'Get block';
    }

    @Delete()
    deleteBlock() {
        return 'block deleted';
    }

    @Patch()
    updateBlock() {
        return 'block updated';
    }
}
