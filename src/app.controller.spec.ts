import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService]
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root', () => {
        it('should return Health', () => {
            expect(appController.getHealth()).toBe({
                name: process.env.npm_package_name,
                version: process.env.npm_package_version
            });
        });
    });
});
