import { Module } from '@nestjs/common';

@Module({})
export class MockTypeOrmModule {
  static forRoot() {
    return {
      module: MockTypeOrmModule,
    };
  }

  static forFeature() {
    return {
      module: MockTypeOrmModule,
    };
  }
}
