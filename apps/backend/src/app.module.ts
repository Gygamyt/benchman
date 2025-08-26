import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { appConfig } from './config/config';
import { ProjectsModule } from './projects/projects.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
        }),

        MongooseModule.forRootAsync({
            inject: [appConfig.KEY],
            useFactory: async (config: ConfigType<typeof appConfig>) => ({
                uri: config.databaseUrl,
            }),
        }),

        UsersModule,

        ProjectsModule,
    ],
    controllers: [],
    providers: [],
})

export class AppModule {}
