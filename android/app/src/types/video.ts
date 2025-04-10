export type ReelItem = {
  id: string;
  videoUrl: string;
  description?: string;
  likes?: any[];
  comments?: any[];
  user?: {
    name: string;
    profile_pic?: string;
  };
};

export type ReelsScreenProps = {
  isActive: boolean;
};
