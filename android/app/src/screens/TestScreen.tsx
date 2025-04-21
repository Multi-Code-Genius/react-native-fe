import React, {useEffect, useState} from 'react';
import {Chat, MessageType, darkTheme} from '@flyerhq/react-native-chat-ui';
import {launchImageLibrary} from 'react-native-image-picker';
import {useTheme} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';
import {useSocketStore} from '../store/socketStore';
import {useGetMessages} from '../api/message/useMessages';

const loggedInUserId = '91fd5ece-4bf1-4830-8ac7-867f3a3cf4f0';
const receiverId = '3cf5033f-b1bb-4816-aca0-fe4a59a4d445';

const uuidv4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 8;
    return v.toString(16);
  });

const TestScreen = () => {
  const [messages, setMessages] = useState<MessageType.Any[]>([]);
  const [messageQueue, setMessageQueue] = useState<any[]>([]);
  const isFocused = useIsFocused();
  const theme = useTheme();
  const {socket, connectSocket, disconnectSocket} = useSocketStore();

  const currentUser = {
    id: loggedInUserId,
    firstName: 'You',
  };

  const otherUser = {
    id: receiverId,
    firstName: 'Other',
  };

  const {data: chatHistory} = useGetMessages({
    userId: loggedInUserId,
    withUserId: receiverId,
  });

  useEffect(() => {
    if (chatHistory?.length) {
      const mapped = chatHistory.map(msg => ({
        id: msg.id || uuidv4(),
        type: 'text',
        text: msg.content,
        createdAt: new Date(msg.createdAt).getTime(),
        author: msg.senderId === loggedInUserId ? currentUser : otherUser,
      }));
      setMessages(mapped.reverse());
    }
  }, [chatHistory]);

  // Socket connection
  useEffect(() => {
    if (isFocused) {
      connectSocket(loggedInUserId);
    } else {
      disconnectSocket();
    }

    return () => disconnectSocket();
  }, [isFocused]);
  console.log('-=----->', chatHistory);

  // New message via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = msg => {
      const formatted: MessageType.Text = {
        id: msg.id || uuidv4(),
        type: 'text',
        text: msg.content,
        createdAt: Date.now(),
        author: msg.senderId === loggedInUserId ? currentUser : otherUser,
      };
      setMessages(prev => [formatted, ...prev]);
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket]);

  const addMessage = (message: MessageType.Any) => {
    setMessages(prev => [message, ...prev]);
  };

  const handleSendPress = (partial: MessageType.PartialText) => {
    const newMessage: MessageType.Text = {
      id: uuidv4(),
      type: 'text',
      text: partial.text,
      createdAt: Date.now(),
      author: currentUser,
    };

    // Update local UI
    addMessage(newMessage);

    // Send via socket
    socket?.emit('sendMessage', {
      senderId: loggedInUserId,
      receiverId,
      content: partial.text,
    });
  };

  const handleImageSelection = () => {
    launchImageLibrary(
      {
        includeBase64: true,
        maxWidth: 1440,
        mediaType: 'photo',
        quality: 0.7,
      },
      ({assets}) => {
        const response = assets?.[0];

        if (response?.base64) {
          const imageMessage: MessageType.Image = {
            author: currentUser,
            createdAt: Date.now(),
            height: response.height,
            id: uuidv4(),
            name: response.fileName ?? response.uri?.split('/').pop() ?? '🖼',
            size: response.fileSize ?? 0,
            type: 'image',
            uri: `data:image/*;base64,${response.base64}`,
            width: response.width,
          };
          addMessage(imageMessage);
        }
      },
    );
  };

  return (
    <Chat
      messages={messages}
      onSendPress={handleSendPress}
      user={currentUser}
      onAttachmentPress={handleImageSelection}
      showUserAvatars
      showUserNames
      theme={{
        ...darkTheme,
        colors: {
          ...darkTheme.colors,
          background: theme.colors.background,
          primary: theme.colors.primary,
          secondary: theme.colors.surfaceVariant,
          inputBackground: theme.colors.surfaceVariant,
        },
        fonts: {
          ...darkTheme.fonts,
          sentMessageBodyTextStyle: {
            fontFamily: theme.fonts.default,
            color: theme.colors.onPrimary,
          },
          receivedMessageBodyTextStyle: {
            fontFamily: theme.fonts.default,
            color: theme.colors.onPrimary,
          },
          inputTextStyle: {
            fontFamily: theme.fonts.default,
          },
        },
      }}
    />
  );
};

export default TestScreen;
