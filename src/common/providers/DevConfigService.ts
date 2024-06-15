import { Injectable } from '@nestjs/common';

@Injectable()
export class DevConfigService {
  DBHost = 'localhost';
  getDBHost() {
    return this.DBHost;
  }
}
