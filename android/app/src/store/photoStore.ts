import {create} from 'zustand';
import {PhotoState} from '../types/photo';

export const photoStore = create<PhotoState>((set, get) => ({
  photoLikeStatus: [],
  updatePhotoLikeStatus: (id: string) => {
    const current = get().photoLikeStatus;
    if (current.includes(id)) {
      set({photoLikeStatus: current.filter(i => i !== id)});
    } else {
      set({photoLikeStatus: [...current, id]});
    }
  },
  addLikesPhoto: (id: string) =>
    set(state => ({
      photoLikeStatus: [...state.photoLikeStatus, id],
    })),
}));
