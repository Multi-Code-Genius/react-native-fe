import React from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CommentSheet = () => {
  const comments = [
    {
      id: 1,
      username: 'user1',
      text: 'This is so cool! 😍',
      time: '2h',
      likes: 24,
    },
    {
      id: 2,
      username: 'traveler',
      text: 'Where was this taken?',
      time: '3h',
      likes: 5,
    },
    {
      id: 3,
      username: 'foodie',
      text: 'Amazing content!',
      time: '4h',
      likes: 12,
    },
    {
      id: 4,
      username: 'photographer',
      text: 'Great composition 👌',
      time: '5h',
      likes: 8,
    },
    {
      id: 5,
      username: 'adventurer',
      text: 'I want to go there!',
      time: '6h',
      likes: 15,
    },
    {
      id: 6,
      username: 'artist',
      text: 'Beautiful colors!',
      time: '7h',
      likes: 7,
    },
    {
      id: 7,
      username: 'nature_lover',
      text: 'Nature at its best 🌿',
      time: '8h',
      likes: 32,
    },
    {
      id: 8,
      username: 'explorer',
      text: 'Been there last summer!',
      time: '9h',
      likes: 4,
    },
    {
      id: 9,
      username: 'digital_creator',
      text: 'What camera did you use?',
      time: '10h',
      likes: 9,
    },
    {
      id: 10,
      username: 'wanderlust',
      text: 'Adding this to my bucket list!',
      time: '11h',
      likes: 18,
    },
    {
      id: 11,
      username: 'photo_enthusiast',
      text: 'Perfect lighting!',
      time: '12h',
      likes: 6,
    },
    {
      id: 12,
      username: 'travelbug',
      text: 'The colors are amazing!',
      time: '13h',
      likes: 11,
    },
    {
      id: 13,
      username: 'sunset_chaser',
      text: 'Golden hour magic ✨',
      time: '14h',
      likes: 25,
    },
    {
      id: 14,
      username: 'mountain_lover',
      text: 'What was the altitude?',
      time: '15h',
      likes: 3,
    },
    {
      id: 15,
      username: 'ocean_viewer',
      text: 'So peaceful!',
      time: '16h',
      likes: 14,
    },
    {
      id: 16,
      username: 'city_explorer',
      text: 'I recognize that place!',
      time: '17h',
      likes: 8,
    },
    {
      id: 17,
      username: 'culture_seeker',
      text: 'Local culture looks fascinating',
      time: '18h',
      likes: 5,
    },
    {
      id: 18,
      username: 'adventure_time',
      text: 'How was the hike?',
      time: '19h',
      likes: 7,
    },
    {
      id: 19,
      username: 'landscape_lover',
      text: 'Worth the early wakeup!',
      time: '20h',
      likes: 9,
    },
    {
      id: 20,
      username: 'travel_addict',
      text: 'Can you share the location?',
      time: '21h',
      likes: 12,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Comments</Text>
        <Icon name="close" size={24} color="white" style={styles.closeIcon} />
      </View>

      {comments.map(comment => (
        <View key={comment.id} style={styles.comment}>
          <View style={styles.avatarPlaceholder}>
            <Icon name="account-circle" size={40} color="#555" />
          </View>
          <View style={styles.commentContent}>
            <Text style={styles.username}>{comment.username}</Text>
            <Text style={styles.commentText}>{comment.text}</Text>
            <View style={styles.commentFooter}>
              <Text style={styles.time}>{comment.time}</Text>
              <Text style={styles.likes}>{comment.likes} likes</Text>
              <Text style={styles.reply}>Reply</Text>
            </View>
          </View>
          <Icon name="heart-outline" size={20} color="#888" />
        </View>
      ))}

      <View style={styles.inputContainer}>
        <View style={styles.avatarPlaceholderSmall}>
          <Icon name="account-circle" size={32} color="#555" />
        </View>
        <Text style={styles.inputPlaceholder}>Add a comment...</Text>
        <Icon name="send" size={24} color="#888" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
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
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
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
