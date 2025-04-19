import {Chat, MessageType} from '@flyerhq/react-native-chat-ui';
import moment from 'moment';
import React, {useState, useEffect} from 'react';
import {launchImageLibrary} from 'react-native-image-picker';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 8;
    return v.toString(16);
  });
};

// Two static users
const currentUser = {
  id: 'user1',
  firstName: 'John',
  imageUrl: 'https://i.pravatar.cc/150?img=3',
};

const otherUser = {
  id: 'user2',
  firstName: 'Alice',
  imageUrl: 'https://i.pravatar.cc/150?img=5',
};

const TestScreen = () => {
  const [messages, setMessages] = useState<MessageType.Any[]>([]);

  // Example static conversation
  useEffect(() => {
    const initialMessages: MessageType.Any[] = [
      {
        id: uuidv4(),
        type: 'text',
        text: 'Hey Alice, how are you?',
        createdAt: Date.now() - 60000,
        author: currentUser,
      },
      {
        id: uuidv4(),
        type: 'text',
        text: 'Hi John! I’m good. Just working on the project.',
        createdAt: Date.now() - 40000,
        author: otherUser,
      },
      {
        id: uuidv4(),
        type: 'text',
        text: 'Nice! Send me the mockups when ready.',
        createdAt: Date.now() - 20000,
        author: currentUser,
      },
    ];
    setMessages(initialMessages);
  }, []);

  const addMessage = (message: MessageType.Any) => {
    setMessages(prev => [message, ...prev]);
  };

  const handleSendPress = (message: MessageType.PartialText) => {
    const textMessage: MessageType.Text = {
      author: currentUser,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message.text,
      type: 'text',
    };
    addMessage(textMessage);

    // Simulate reply from Alice after 1s
    setTimeout(() => {
      const reply: MessageType.Text = {
        author: otherUser,
        createdAt: Date.now(),
        id: uuidv4(),
        text: 'Sure! I’ll send them in a minute 😊',
        type: 'text',
      };
      addMessage(reply);
    }, 1000);
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
    <SafeAreaProvider>
      <Chat
        messages={messages}
        onSendPress={handleSendPress}
        user={currentUser}
        onAttachmentPress={handleImageSelection}
        showUserAvatars
        showUserNames
      />
    </SafeAreaProvider>
  );
};

export default TestScreen;
