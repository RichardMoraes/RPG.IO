import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway({
  namespace: 'global',
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class appGateway {
  @SubscribeMessage('connection')
  handleEvent(@MessageBody() data: string): string {
    console.log(`User connected to global namespace`);
    return data;
  }
}
