import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: Socket;
  private readonly url = 'http://localhost:3000'; // Your server URL

  public messages = new BehaviorSubject<any[]>([]);
  public currentUser: string = '';

  constructor() {
    // Initialize socket connection
    this.socket = io(this.url);

    // Listen for incoming messages
    this.socket.on('chat message', (msg: any) => {
      const currentMessages = this.messages.value;
      this.messages.next([...currentMessages, msg]);
      console.log('Received message:', msg);
    });
  }

  connect(user: string) {
    this.currentUser = user;
    this.socket.emit('join', user); // Inform the server about the new connection
    console.log(`${user} connected to socket`);
  }

  sendMessage(message: any, recipient: string) {
    this.socket.emit('chat message', { ...message, recipient, sender: this.currentUser });
    console.log('Message emitted:', message);
  }

  fetchMessages(user1: string, user2: string): Promise<any[]> {
    // Fetch initial messages from the server (one-time request)
    return fetch(`${this.url}/messages/${user1}/${user2}`)
      .then(response => response.json())
      .catch(error => {
        console.error('Error fetching messages:', error);
        return [];
      });
  }
}

