import { DataSource } from  'typeorm' ; 
import {join} from  'path' ; 
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.development' })

export  const connectionSource = new  DataSource ({ 
    type: 'postgres',
    host: process.env.BD_HOST,
    port: +process.env.BD_PORT,
    username: process.env.BD_USERNAME,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_DATABASE,
    entities : [__dirname + '/../**/*.entity{.ts,.js}' ], 
    migrations: [join(__dirname, '../migrations/*')],
    synchronize: false,
    migrationsRun : false
});