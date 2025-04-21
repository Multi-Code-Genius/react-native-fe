import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {Appbar, Avatar, Text, useTheme} from 'react-native-paper';
import {Chat, MessageType, darkTheme} from '@flyerhq/react-native-chat-ui';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  useIsFocused,
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import {useSocketStore} from '../store/socketStore';
import {useUserStore} from '../store/userStore';
import {useChatMessages} from '../api/message/useMessages';
import {useUserListLogic} from '../hooks/useUserListLogic';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const uuidv4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const ChatScreen = () => {
  const [messages, setMessages] = useState<MessageType.Any[]>([]);
  const {data} = useUserListLogic();
  const theme = useTheme();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {socket, connectSocket, disconnectSocket} = useSocketStore();
  const {userData} = useUserStore();
  const route = useRoute();
  const chatRef = useRef<any>(null); // useRef for scrollToBottom functionality
  const insets = useSafeAreaInsets();

  const {receiverId, profile_pic, name} = route.params as {
    receiverId: string;
    profile_pic: string;
    name: string;
  };

  const loggedInUserId = userData?.id || '';

  const currentUser = useMemo(
    () => ({id: loggedInUserId, firstName: data.user.name}),
    [loggedInUserId, data.user.name],
  );

  const otherUser = useMemo(
    () => ({id: receiverId, imageUrl: profile_pic, firstName: name}),
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
    if (!chatHistory?.pages?.length) return;

    const allMessages = chatHistory.pages
      .flatMap(page => page)
      .map(msg => ({
        id: msg.id,
        type: 'text',
        text: msg.content,
        createdAt: new Date(msg.createdAt).getTime(),
        author: msg.senderId === loggedInUserId ? currentUser : otherUser,
      }))
      .sort((a, b) => b.createdAt - a.createdAt);

    setMessages(prev => {
      const seen = new Set(prev.map(m => m.id));
      const merged = [...prev];
      for (const m of allMessages) {
        if (!seen.has(m.id)) merged.push(m);
      }
      return merged.sort((a, b) => b.createdAt - a.createdAt);
    });
  }, [chatHistory]);

  useEffect(() => {
    if (isFocused) {
      connectSocket(loggedInUserId);
    } else {
      disconnectSocket();
    }
    return () => disconnectSocket();
  }, [isFocused, loggedInUserId]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = msg => {
      const message: MessageType.Text = {
        id: msg.id || uuidv4(),
        type: 'text',
        text: msg.content,
        createdAt: Date.now(),
        author: msg.senderId === loggedInUserId ? currentUser : otherUser,
      };
      setMessages(prev => [message, ...prev]);
    };

    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [socket]);

  const handleSendPress = (partial: MessageType.PartialText) => {
    const message: MessageType.Text = {
      id: uuidv4(),
      type: 'text',
      text: partial.text,
      createdAt: Date.now(),
      author: currentUser,
    };
    setMessages(prev => [message, ...prev]);
    socket?.emit('sendMessage', {
      senderId: loggedInUserId,
      receiverId,
      content: partial.text,
    });

    setTimeout(() => {
      chatRef.current?.scrollToBottom({animated: true});
    }, 200);
  };

  const handleImageSelection = () => {
    launchImageLibrary(
      {
        includeBase64: true,
        mediaType: 'photo',
        quality: 0.7,
      },
      ({assets}) => {
        const img = assets?.[0];
        if (img?.base64) {
          const message: MessageType.Image = {
            id: uuidv4(),
            type: 'image',
            uri: `data:image/*;base64,${img.base64}`,
            name: img.fileName ?? 'Image',
            createdAt: Date.now(),
            height: img.height,
            width: img.width,
            size: img.fileSize ?? 0,
            author: currentUser,
          };
          setMessages(prev => [message, ...prev]);

          setTimeout(() => {
            chatRef.current?.scrollToBottom({animated: true});
          }, 100);
        }
      },
    );
  };

  useEffect(() => {
    if (messages.length > 0) {
      chatRef.current?.scrollToBottom({animated: true});
    }
  }, [messages]);

  return (
    <View style={styles.container}>
      <Appbar.Header elevated style={{paddingHorizontal: 8}}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          {profile_pic ? (
            <Avatar.Image size={36} source={{uri: otherUser.imageUrl}} />
          ) : (
            <Avatar.Text
              size={36}
              label={otherUser.firstName.slice(0, 2).toUpperCase()}
              style={{backgroundColor: theme.colors.secondary}}
            />
          )}
          <View style={{marginLeft: 12}}>
            <Text style={{fontSize: 16, color: theme.colors.onPrimary}}>
              {otherUser.firstName}
            </Text>
          </View>
        </View>
      </Appbar.Header>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 60 : 0}>
        <View style={{flex: 1}}>
          <Chat
            messages={messages}
            onSendPress={handleSendPress}
            ref={chatRef}
            user={currentUser}
            onAttachmentPress={handleImageSelection}
            showUserAvatars
            showUserNames
            isLastPage={!hasNextPage}
            onEndReached={fetchNextPage}
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
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollButton: {
    position: 'absolute',
    bottom: '10%',
    right: 20,
    height: 40,
    width: 40,
    backgroundColor: '#007BFF',
    borderRadius: 30,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ChatScreen;
