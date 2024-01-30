import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nestUsers', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any),
    
    UserModule,
  ],
})
export class AppModule implements OnModuleInit {
  async onModuleInit() {
    console.log('Connected to database successfully');
  }
}
