// component/MqttClient.tsx

import mqtt, { MqttClient as Client } from 'mqtt';

class MqttClient {
  private client: Client;
  private isConnected: boolean = false;
  private topics: string[] = [];
  private topicCallbacks: Map<string, (topic: string, message: string) => void> = new Map();

  constructor() {
    // Connect to the MQTT broker
    this.client = mqtt.connect('ws://broker.hivemq.com:8000/mqtt'); // Example broker

    // Set up listeners
    this.client.on('connect', () => {
      this.isConnected = true;
      this.loopSubscribe();
      console.log('Connected to MQTT broker');
    });

    this.client.on('error', (err) => {
      console.error('Connection error:', err);
      this.isConnected = false;
    });

    this.client.on('close', () => {
      this.isConnected = false;
      console.log('Disconnected from MQTT broker');
    });

    // General message listener for all topics
    this.client.on('message', (msgTopic, msg) => {
      const callback = this.topicCallbacks.get(msgTopic);
      if (callback) {
        callback(msgTopic, msg.toString());
      }
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

  // Method to publish a message to a specific topic
  public sendMessage(topic: string, message: string): void {
    if (this.isConnected) {
      this.client.publish(topic, message);
      console.log(`Message sent to ${topic}: ${message}`);
    } else {
      console.warn('Cannot send message. MQTT client is disconnected.');
    }
  }

  public subscribe(topic: string): void {
    if (this.isConnected) {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to topic ${topic}:`, err);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
        }
      });
    } else {
      console.warn('Cannot subscribe. MQTT client is disconnected.');
    }
  }

  // Method to close the connection
  public disconnect(): void {
    if (this.client) {
      this.client.end();
      console.log('MQTT client disconnected');
    }
  }
}

export default MqttClient;
