import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {Chat, MessageType, darkTheme} from '@flyerhq/react-native-chat-ui';
import {launchImageLibrary} from 'react-native-image-picker';
import {useIsFocused, useRoute, useNavigation} from '@react-navigation/native';
import {useSocketStore} from '../store/socketStore';
import {useUserStore} from '../store/userStore';
import {useFocusEffect} from '@react-navigation/native';
import {useChatMessages} from '../api/message/useMessages';
import {useUserListLogic} from '../hooks/useUserListLogic';

const uuidv4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 8;
    return v.toString(16);
  });

const ChatScreen = () => {
  const [messages, setMessages] = useState<MessageType.Any[]>([]);
  const {data} = useUserListLogic();

  const isFocused = useIsFocused();
  const theme = useTheme();
  const {socket, connectSocket, disconnectSocket} = useSocketStore();
  const {userData} = useUserStore();
  const route = useRoute();
  const navigation = useNavigation();
  const {receiverId, profile_pic, name} = route.params as {
    receiverId: string;
    profile_pic: string;
    name: string;
  };
  const loggedInUserId = userData?.id || '';

  const currentUser = useMemo(
    () => ({
      id: loggedInUserId,
      firstName: data.user.name,
    }),
    [loggedInUserId, data.user.name],
  );

  const otherUser = useMemo(
    () => ({
      id: receiverId,
      imageUrl: profile_pic,
      firstName: name,
      lastSeen: '2022-01-01',
    }),
    [receiverId, profile_pic, name],
  );

  const {
    data: chatHistory,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useChatMessages(loggedInUserId, receiverId);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useEffect(() => {
    if (chatHistory?.pages[0]?.length) {
      const mapped = chatHistory?.pages[0]?.map(msg => ({
        id: msg.id || uuidv4(),
        type: 'text',
        text: msg.content,
        createdAt: new Date(msg.createdAt).getTime(),
        author: msg.senderId === loggedInUserId ? currentUser : otherUser,
      }));
      setMessages(mapped.reverse());
    }
  }, [chatHistory, loggedInUserId, currentUser, otherUser]);

  useEffect(() => {
    if (isFocused) {
      connectSocket(loggedInUserId);
    } else {
      disconnectSocket();
    }
    return () => disconnectSocket();
  }, [isFocused, connectSocket, disconnectSocket, loggedInUserId]);

  useEffect(() => {
    if (!socket) {
      return;
    }

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
  }, [socket, currentUser, loggedInUserId, otherUser]);

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

    addMessage(newMessage);

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
    <View style={styles.container}>
      <Appbar.Header elevated>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Chat" />
      </Appbar.Header>

      <Chat
        messages={messages}
        onSendPress={handleSendPress}
        user={currentUser}
        onAttachmentPress={handleImageSelection}
        showUserAvatars
        showUserNames
        isLastPage={!hasNextPage}
        hasNextPage={hasNextPage}
        onLoadMore={fetchNextPage}
        isLoadingMore={isFetchingNextPage}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ChatScreen;
