import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { EventEntity } from '../persistence/event.entity';
import { Event } from 'src/modules/events/domain/entities/event';
import { Uuid } from 'src/shared/domain/value-objects/uuid.vo';
import { EventMapper } from '../mappers/event.mapper';
import { ChannelEnum } from 'src/modules/events/domain/value-objects/channel.vo';
import { ProjectsEnums } from 'src/modules/events/domain/value-objects/projects.vo';

export class EventsSeeds implements Seeder {
  private readonly events: Event[] = [
    Event.create({
      id: '00000000-0000-0000-0000-000000000001' as Uuid,
      name: 'User registered',
      code: 'USER_REGISTERED',
      project: ProjectsEnums.AUCTION,
      description: 'Event triggered when a user registers',
      channel: ChannelEnum.EMAIL,
      title: 'Welcome to Our Service!',
      content: `
                  <h1>Thank you for registering!</h1>
                  <p>We're excited to have you on board.</p>
                  <p>If you have any questions or need assistance, please contact our support team at <a href="mailto:baoduong1709@gmail.com">baoduong1709@gmail.com</a>.</p>
                  <p>Best regards,<br/>The Team</p>
                  `,
      autoSubscribe: true,
      params: [],
    }),
    Event.create({
      id: '00000000-0000-0000-0000-000000000002' as Uuid,
      name: 'Password reset requested',
      code: 'PASSWORD_RESET_REQUESTED',
      description: 'Event triggered when a user requests a password reset',
      autoSubscribe: true,
      channel: ChannelEnum.EMAIL,
      project: ProjectsEnums.AUCTION,
      title: 'Password Reset Request',
      content:
        "<h1>Password Reset</h1><p>Click <a href='{{resetLink}}'>here</a> to reset your password.</p>",
      params: ['resetLink'],
    }),
    Event.create({
      id: '00000000-0000-0000-0000-000000000003' as Uuid,
      name: 'Bid notification',
      code: 'BID_NOTIFICATION',
      description: 'Event triggered when a bid is placed on my item',
      autoSubscribe: true,
      project: ProjectsEnums.AUCTION,
      channel: ChannelEnum.WEB,
      title: 'New Bid Placed on Your Item',
      content:
        'A new bid by {{bidderName}} has been placed on your item {{itemName}}.',
      params: ['bidAmount', 'bidderName', 'itemName', 'actionUrl', 'imageUrl'],
    }),
    Event.create({
      id: '00000000-0000-0000-0000-000000000004' as Uuid,
      name: 'Auction ending soon',
      code: 'AUCTION_ENDING_SOON',
      description: 'Event triggered when your auctions are about to end',
      autoSubscribe: true,
      project: ProjectsEnums.AUCTION,
      channel: ChannelEnum.WEB,
      title: 'Auction Ending Soon',
      content: 'Your auction for {{itemName}} is ending in {{timeLeft}}.',
      params: ['itemName', 'timeLeft', 'actionUrl', 'imageUrl'],
    }),
    Event.create({
      id: '00000000-0000-0000-0000-000000000005' as Uuid,
      name: 'Outbid notification',
      code: 'OUTBID_NOTIFICATION',
      description: 'Event triggered when you have been outbid on an item',
      project: ProjectsEnums.AUCTION,
      autoSubscribe: true,
      channel: ChannelEnum.WEB,
      title: "You've Been Outbid!",
      content:
        "You've been outbid on '{{itemName}}'. The current highest bid is {{highestBid}}.",
      params: ['itemName', 'highestBid', 'actionUrl', 'imageUrl'],
    }),
    Event.create({
      id: '00000000-0000-0000-0000-000000000006' as Uuid,
      name: 'Auction won',
      code: 'AUCTION_WON',
      description: 'Event triggered when you win an auction',
      project: ProjectsEnums.AUCTION,
      autoSubscribe: true,
      channel: ChannelEnum.EMAIL,
      title: "Congratulations! You've Won the Auction",
      content: `
                <!doctype html>
                    <html lang="en">
                    <head>
                        <meta charset="utf-8" />
                        <title>Congratulations — You won the auction!</title>
                        <style>
                            body {
                                margin: 0;
                                padding: 0;
                                background-color: #f4f6f8;
                                font-family: Arial, Helvetica, sans-serif;
                                color: #333;
                            }

                            .container {
                                max-width: 640px;
                                margin: 0 auto;
                                padding: 24px 16px;
                            }

                            .card {
                                background: #ffffff;
                                border-radius: 10px;
                                overflow: hidden;
                                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
                            }

                            .header {
                                background: linear-gradient(135deg, #2c5282, #3182ce);
                                color: #ffffff;
                                padding: 20px 24px;
                            }

                            .header h1 {
                                font-size: 20px;
                                margin: 0;
                            }

                            .content {
                                padding: 24px;
                            }

                            p {
                                margin: 10px 0;
                                line-height: 1.5;
                            }

                            .item-name {
                                font-weight: bold;
                                color: #2c5282;
                            }

                            table {
                                width: 100%;
                                border-collapse: collapse;
                                margin: 16px 0;
                                font-size: 14px;
                            }

                            th {
                                text-align: left;
                                background-color: #f7fafc;
                                color: #555;
                                padding: 10px;
                                width: 40%;
                            }

                            td {
                                padding: 10px;
                                border-bottom: 1px solid #eee;
                            }

                            tr:last-child td {
                                border-bottom: none;
                            }

                            .price {
                                color: #2f855a;
                                font-weight: bold;
                                font-size: 15px;
                            }

                            .divider {
                                height: 1px;
                                background-color: #eee;
                                margin: 20px 0;
                            }

                            .owner-box {
                                background-color: #f7fafc;
                                padding: 14px;
                                border-radius: 6px;
                                font-size: 14px;
                            }

                            .footer {
                                text-align: center;
                                font-size: 12px;
                                color: #888;
                                padding: 16px;
                                background-color: #fafafa;
                            }

                            @media (max-width: 480px) {
                                .content {
                                    padding: 16px;
                                }
                                th, td {
                                    padding: 8px;
                                }
                            }
                        </style>
                    </head>

                    <body>
                        <div class="container">
                            <div class="card">
                                <div class="header">
                                    <h1>🎉 Congratulations, {{winnerName}}!</h1>
                                </div>

                                <div class="content">
                                    <p>
                                        You are the winner of the auction for
                                        <span class="item-name">{{itemName}}</span>.
                                    </p>

                                    <table>
                                        <tr>
                                            <th>Item</th>
                                            <td>{{itemName}}</td>
                                        </tr>
                                        <tr>
                                            <th>Description</th>
                                            <td>{{description}}</td>
                                        </tr>
                                        <tr>
                                            <th>Starting Price</th>
                                            <td class="price">{{startingPrice}}</td>
                                        </tr>
                                        <tr>
                                            <th>Final Price</th>
                                            <td class="price">{{finalPrice}}</td>
                                        </tr>
                                        <tr>
                                            <th>Auction Started</th>
                                            <td>{{startTime}}</td>
                                        </tr>
                                        <tr>
                                            <th>Auction Ended</th>
                                            <td>{{endTime}}</td>
                                        </tr>
                                    </table>

                                    <div class="divider"></div>

                                    <div class="owner-box">
                                        <strong>Owner</strong><br />
                                        {{ownerName}}<br />
                                        <a href="mailto:{{ownerEmail}}" style="color:#3182ce; text-decoration:none;">
                                            {{ownerEmail}}
                                        </a>
                                    </div>

                                    <p style="margin-top: 16px;">
                                        If you have any questions about the transaction, please contact the owner directly.
                                    </p>
                                </div>

                                <div class="footer">
                                    Thank you for using our auction platform.<br />
                                    © 2026 Auction System
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>`,
      params: [
        'winnerName',
        'itemName',
        'description',
        'startingPrice',
        'finalPrice',
        'startTime',
        'endTime',
        'ownerName',
        'ownerEmail',
      ],
    }),
  ];

  async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(EventEntity);

    return await repository.save(EventMapper.toEntities(this.events));
  }
}
