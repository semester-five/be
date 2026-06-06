import { Inject, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CommandBus } from '@nestjs/cqrs';
import { connect, MqttClient } from 'mqtt';
import { LockerSyncStatusCommand } from 'src/modules/lockers/cqrs/commands/implements/locker-sync-status.command';
import { DoorStateVO } from 'src/modules/lockers/value-objects/door-state.vo';
import { ApiConfigService } from 'src/shared/services/api-config.service';

interface StatusPayload {
  cabinet1?: { door?: string; hasItem?: boolean };
  cabinet2?: { door?: string; hasItem?: boolean };
}

@Injectable()
export class MqttService implements OnModuleInit {
  private readonly logger = new Logger(MqttService.name);
  private subscriberClient: MqttClient | null = null;

  constructor(
    @Inject('MQTT_SERVICE')
    private readonly client: ClientProxy,
    private readonly commandBus: CommandBus,
    private readonly apiConfigService: ApiConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.initSubscriber();
  }

  private initSubscriber(): Promise<void> {
    return new Promise<void>((resolve) => {
      const url = this.apiConfigService.mqttBrokerUrl;

      this.subscriberClient = connect(url);

      this.subscriberClient.on('connect', () => {
        this.logger.log('MQTT subscriber connected');

        this.subscriberClient?.subscribe('lockers/status', (err) => {
          if (err) {
            this.logger.error('Failed to subscribe to lockers/status', err);
          } else {
            this.logger.log('Subscribed to lockers/status');
          }
        });

        resolve();
      });

      this.subscriberClient.on('message', (topic: string, raw: Buffer) => {
        const msg = raw.toString();
        this.logger.log(`[SUB] ${topic} => ${msg}`);

        if (topic === 'lockers/status') {
          this.handleStatusMessage(msg);
        }
      });

      this.subscriberClient.on('error', (err) => {
        this.logger.error('MQTT subscriber error', err.message);
      });
    });
  }

  private handleStatusMessage(payload: string): void {
    try {
      const data = JSON.parse(payload) as StatusPayload;

      const cabinet1Door =
        data.cabinet1?.door === 'open' ? DoorStateVO.OPEN : DoorStateVO.CLOSED;
      const cabinet1HasItem = data.cabinet1?.hasItem === true;

      const cabinet2Door =
        data.cabinet2?.door === 'open' ? DoorStateVO.OPEN : DoorStateVO.CLOSED;
      const cabinet2HasItem = data.cabinet2?.hasItem === true;

      void this.commandBus.execute(
        new LockerSyncStatusCommand(
          cabinet1Door,
          cabinet1HasItem,
          cabinet2Door,
          cabinet2HasItem,
        ),
      );

      this.logger.log(
        `[SYNC] cabinet1={door:${cabinet1Door},hasItem:${cabinet1HasItem}} cabinet2={door:${cabinet2Door},hasItem:${cabinet2HasItem}}`,
      );
    } catch (error) {
      this.logger.error('Failed to parse locker status message', error);
    }
  }

  public publish(topic: string, message: unknown): void {
    this.logger.log(`[PUB] ${topic} => ${JSON.stringify(message)}`);
    this.client.emit(topic, message);
  }
}
