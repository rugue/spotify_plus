import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'rugue',
  password: 'rugue',
  database: 'songs',
  entities: ['dist/**/*.entity{.ts,.js}'], //1
  synchronize: false, // 2
  migrations: ['dist/db/migrations/*{.ts,.js}'], // 3
};
const dataSource = new DataSource(dataSourceOptions); //4
export default dataSource;

// DB_TYPE=postgres
// DB_HOST=localhost
// DB_PORT=5432
// DB_USERNAME=rugue
// DB_PASSWORD=rugue
// DB_DATABASE=songs
// DB_ENTITIES=dist/**/*.entity{.ts,.js}
// JWT_SECRET=7b17a4732ea7befc999641a00c4f3775c5efad688dde86a2ca4dd60017b4d5d5

// {
//   type: process.env.DB_TYPE as 'postgres',
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   entities: [__dirname + '/**/*.entity{.ts,.js}'],
//   synchronize: true,
// }
