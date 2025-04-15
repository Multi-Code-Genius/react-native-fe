import {create} from 'zustand';
import {VideoState} from '../types/video';

export const videoStore = create<VideoState>((set, get) => ({
  videoData: null,
  videoLikeStatus: [],
  updateVideoLikeStatus: async (id: string) => {
    const currentLikes = get().videoLikeStatus;
    if (!currentLikes.includes(id)) {
      set({videoLikeStatus: [...currentLikes, id]});
    } else {
      set({videoLikeStatus: currentLikes.filter(item => item !== id)});
    }
  },

  addLikesReels: (id: string) =>
    set(state => ({
      videoLikeStatus: [...state.videoLikeStatus, id],
    })),
}));
