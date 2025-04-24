import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Avatar, Divider, Text} from 'react-native-paper';
import {CommentsTypes} from '../types/video';

const CommentSheet = ({comments}: {comments: CommentsTypes[] | []}) => {
  return (
    <View style={styles.container}>
      {comments.map(comment => (
        <View key={comment.id} style={styles.comment}>
          <View style={styles.avatarPlaceholder}>
            <Avatar.Image
              size={24}
              source={{uri: comment?.user?.profile_pic}}
            />
          </View>
          <View style={styles.commentContent}>
            <Text style={styles.username}>{comment?.user?.name}</Text>
            <Text style={styles.commentText}>{comment.text}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeIcon: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
    minHeight: '100%',
  },
  comment: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  avatarPlaceholder: {
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentText: {
    color: 'white',
    marginBottom: 4,
  },
  commentFooter: {
    flexDirection: 'row',
    marginTop: 4,
  },
  time: {
    color: '#888',
    fontSize: 12,
    marginRight: 16,
  },
  likes: {
    color: '#888',
    fontSize: 12,
    marginRight: 16,
  },
  reply: {
    color: '#888',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
  },
  avatarPlaceholderSmall: {
    marginRight: 12,
  },
  inputPlaceholder: {
    color: '#888',
    flex: 1,
    fontSize: 14,
  },
});

export default CommentSheet;
