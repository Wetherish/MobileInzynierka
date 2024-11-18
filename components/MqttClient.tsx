import { Client as PahoClient, Message } from 'paho-mqtt';
type Pair = [string, string];

class MqttClient {
  private client: PahoClient;
  private isConnected: boolean = false;
  private topics: string[] = [];
  private topicCallbacks: Map<string, (topic: string, message: string) => void> = new Map();
  private lostMsgs: Pair[] = [];

  constructor() {
    this.client = new PahoClient(
        'raspberrypi',
        Number(9001),
        `mqttjs_${Math.random().toString(16).slice(2)}` // Unique client ID
    );

    this.client.onConnected = () => {
      this.isConnected = true;
      this.loopSubscribe();
      console.log('Connected to MQTT broker :)');

      if (this.lostMsgs.length > 0) {
        for (let pair of this.lostMsgs) {
          this.sendMessage(pair[0], pair[1]);
          console.log("Restored message to topic:", pair[0], "with content:", pair[1]);
        }
        this.lostMsgs = [];
      }
    };

    this.client.onConnectionLost = (responseObject) => {
      this.isConnected = false;
      console.error('Disconnected from MQTT broker:', responseObject.errorMessage || 'Unknown error');
    };

    this.client.onMessageArrived = (message: Message) => {
      const topic = message.destinationName;
      const payload = message.payloadString;
      console.log(`Message arrived on topic ${topic}: ${payload}`);

      const callback = this.topicCallbacks.get(topic);
      if (callback) {
        callback(topic, payload);
      } else {
        console.warn(`No callback registered for topic ${topic}`);
      }
    };

    this.client.connect({
      onSuccess: () => console.log('MQTT connection established'),
      onFailure: (error) => console.error('MQTT connection error:', error),
      useSSL: false,
      userName: "mobile",
      password: "lokomotywa",
    });
  }

  public addTopic(topic: string, callback: (topic: string, message: string) => void): void {
    this.topics.push(topic);
    this.topicCallbacks.set(topic, callback);
  }

  private loopSubscribe(): void {
    for (const topic of this.topics) {
      this.subscribe(topic);
    }
  }

  public sendMessage(topic: string, message: string): void {
    if (this.isConnected) {
      const msg = new Message(message);
      msg.destinationName = topic;
      this.client.send(msg);
      console.log(`Message sent to ${topic}: ${message}`);
    } else {
      console.warn('Cannot send message. MQTT client is disconnected.');
      this.lostMsgs.push([topic, message]);
    }
  }

  public subscribe(topic: string): void {
    if (this.isConnected) {
      try {
        this.client.subscribe(topic);
        console.log(`Subscribed to topic: ${topic}`);
      } catch (err) {
        console.error(`Failed to subscribe to topic ${topic}:`, err);
      }
    } else {
      console.warn('Cannot subscribe. MQTT client is disconnected.');
    }
  }

  public disconnect(): void {
    if (this.isConnected) {
      this.client.disconnect();
      console.log('MQTT client disconnected');
    }
  }
}

export default MqttClient;
