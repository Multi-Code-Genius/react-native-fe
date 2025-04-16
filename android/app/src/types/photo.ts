export interface PhotoState {
  photoLikeStatus: string[];
  updatePhotoLikeStatus: (id: string) => void;
  addLikesPhoto: (id: string) => void;
}
