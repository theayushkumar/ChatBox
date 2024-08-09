import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ChatService } from 'src/app/service/chat.service';

export interface Message {
  message?: string;
  timestamp?: string;
  sender?: string;
  date?: string;
}

@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.scss'],
})
export class ChatPanelComponent implements OnInit {
  messages: { date: string, messages: Message[] }[] = [];
  
  // currentUser: string = 'Akhilesh'; // Replace with actual user logic
  // currentRecipient: string = 'Ayush'; // Placeholder recipient

  currentUser: string = 'Ayush'; // Replace with actual user logic
  currentRecipient: string = 'Akhilesh'; // Placeholder recipient

  @ViewChild('chatList') private chatListRef!: ElementRef;

  constructor(private _router: Router, private chatService: ChatService) {}

  ngOnInit() {
    // Establish the socket connection once
    this.chatService.connect(this.currentUser);

    // Fetch initial messages from the server
    this.fetchInitialMessages();

    // Subscribe to messages from the service
    this.chatService.messages.subscribe(msgs => {
      this.messages = this.groupMessagesByDate(msgs);
      console.log('Messages updated:', this.messages);
    });
  }

  fetchInitialMessages() {
    this.chatService.fetchMessages(this.currentUser, this.currentRecipient)
      .then((msgs: Message[]) => {
        this.messages = this.groupMessagesByDate(msgs);
        console.log('Initial messages fetched:', this.messages);
      })
      .catch(error => console.error('Error fetching messages:', error));
  }

  groupMessagesByDate(messages: Message[]): { date: string, messages: Message[] }[] {
    return messages.reduce<{ date: string, messages: Message[] }[]>((acc, msg) => {
      const formattedDate = moment(msg.date).format('MMMM DD, YYYY'); // Format date
      const formattedTime = moment(msg.timestamp, 'HH:mm:ss').format('hh:mm A'); // Format timestamp
      const lastGroup = acc[acc.length - 1];

      if (lastGroup && lastGroup.date === formattedDate) {
        lastGroup.messages.push({
          ...msg,
          timestamp: formattedTime
        });
      } else {
        acc.push({ date: formattedDate, messages: [{
          ...msg,
          timestamp: formattedTime
        }] });
      }

      return acc;
    }, []);
  }

 
  advocateProfile() {
    this._router.navigate(['/home/advocateportfolio']);
  }

  sendMessage(message: any) {
    if (message.trim()) {
      const newMessage: Message = {
        message,
        timestamp: moment().format('hh:mm A'), // Format timestamp
        sender: this.currentUser,
        date: moment().format('YYYY-MM-DD') // Save date in YYYY-MM-DD format
      };
      this.chatService.sendMessage(newMessage, this.currentRecipient);
      this.fetchInitialMessages();
      // Update the chat immediately with the new message
      const currentMessages = this.messages;
      const formattedDate = moment().format('MMMM DD, YYYY');
      const newMessageGroup = { date: formattedDate, messages: [newMessage] };
      
      if (this.messages.length > 0 && this.messages[0].date === formattedDate) {
        this.messages[0].messages.unshift(newMessage); // Add new message to the existing date group
      } else {
        this.messages.unshift(newMessageGroup); // Add new date group
      }

    }
  }
}
