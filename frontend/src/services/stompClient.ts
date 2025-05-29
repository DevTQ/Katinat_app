import SockJS from 'sockjs-client';
import { Client, StompSubscription } from '@stomp/stompjs';
import appInfor from 'src/utils/appInfor';

let stompClient: Client | null = null;
let currentSubscription: StompSubscription | null = null;

export const connectWebSocket = async (
  orderCode: string,
  onMessage: (data: any) => void
) => {
  const subscribeToOrder = () => {
    currentSubscription?.unsubscribe();
    currentSubscription = stompClient?.subscribe(
      `/topic/orders/${orderCode}`,
      (message) => {
        const data = JSON.parse(message.body);
        onMessage(data);
      }
    );
  };

  if (!stompClient) {
    stompClient = new Client({
      webSocketFactory: () => new SockJS(`${appInfor.WS_URL}`),
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('🔌 STOMP connected');
        subscribeToOrder();
      },
      onStompError: (frame) => console.error('❌ STOMP error', frame),
      onWebSocketError: (err) => console.error('❌ WS error', err),
    });
    stompClient.activate();
  } else if (stompClient.connected) {
    subscribeToOrder();
  }
};
export const disconnectWebSocket = () => {
  if (stompClient) {
    currentSubscription?.unsubscribe();
    stompClient.deactivate();
    stompClient = null;
    console.log('🛑 STOMP disconnected');
  }
};
