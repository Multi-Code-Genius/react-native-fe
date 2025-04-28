import {LikeType, VideoType} from './auth';

export type ReelItem = {
  id: string;
  videoUrl: string;
  description?: string;
  likes: LikeType[];
  comments?: CommentsTypes[];
  user?: {
    id: string;
    name: string;
    profile_pic?: string;
  };
};

export type ReelsScreenProps = {
  isActive: boolean;
};
export interface VideoState {
  videoData: VideoType | null;
  videoLikeStatus: string[];
  videoComments: {
    videoId: string;
    id: string;
    text: string;
    userId: string;
    user: any;
  }[];
  updateVideoLikeStatus: (id: string) => void;
  addLikesReels: (id: string) => void;
  addVideoComment: (
    videoId: string,
    comment: {id: string; text: string; userId: string; user: any},
  ) => void;
}

export interface ReelItemProps {
  item: ReelItem;
  index: number;
  currentIndex: number;
  isActive: boolean;
  appState: string;
  usableHeight: number;
  onDoubleTap: (data: boolean) => void;
  onComments: (text: string) => void;
}

export interface CommentsTypes {
  id: string;
  text: string;
  userId: string;
  videoId: string;
  postId: null | string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profile_pic: string;
  };
}
