export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

export interface MessageData {
  senderId: string;
  receiverId: string;
  content: string;
}
