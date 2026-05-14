import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { ClientsModule } from '@nestjs/microservices/module/clients.module';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { ApiConfigService } from 'src/shared/services/api-config.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MQTT_SERVICE',
        useFactory: (apiConfigService: ApiConfigService) => ({
          transport: Transport.MQTT,
          options: {
            url: apiConfigService.mqttBrokerUrl,
          },
        }),
        inject: [ApiConfigService],
      },
    ]),
  ],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
