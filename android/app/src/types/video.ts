import {LikeType, VideoType} from './auth';

export type ReelItem = {
  id: string;
  videoUrl: string;
  description?: string;
  likes: LikeType[];
  comments?: any[];
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
  updateVideoLikeStatus: (id: string) => void;
  addLikesReels: (id: string) => void;
}

export interface ReelItemProps {
  item: ReelItem;
  index: number;
  currentIndex: number;
  isActive: boolean;
  appState: string;
  usableHeight: number;
  onDoubleTap: (data: boolean) => void;
}
