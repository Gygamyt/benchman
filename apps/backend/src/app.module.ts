import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeesModule } from './employees/employees.module';
import { appConfig } from './config/config';
import { ProjectsModule } from './projects/projects.module';
import { RequestsModule } from './requests/requests.module';

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

        EmployeesModule,

        ProjectsModule,

        RequestsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
