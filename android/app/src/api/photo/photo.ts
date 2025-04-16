import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api} from '../../hooks/api';
import {useUserStore} from '../../store/userStore';

export const getAllPosts = async () => {
  try {
    const response = await api('api/post', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    return await response;
  } catch (error) {
    console.error('Get Video Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Video Failed');
  }
};

export const useFetchPostPhotos = () => {
  return useQuery({
    queryKey: ['photos'],
    queryFn: getAllPosts,
    retry: false,
  });
};

export const uploadPhoto = async (data: FormData) => {
  try {
    const response = await api('/api/post/upload-post', {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return await response;
  } catch (error) {
    console.error('Cannot upload video', error);
    throw new Error(error instanceof Error ? error.message : 'Upload failed');
  }
};

export const useUploadPhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['profile']});
    },
    onError: error => {
      console.error('Failed to upload photo:', error);
    },
  });
};

export const fetchSinglePhoto = async (postId: string) => {
  const res = await api(`/api/post/${postId}`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  });
  return res;
};

export const useSinglePhoto = (postId: string) => {
  return useQuery({
    queryKey: ['photo', postId],
    queryFn: () => fetchSinglePhoto(postId),
    enabled: !!postId,
  });
};

export const likePhoto = async (postId: string) => {
  try {
    const response = await api(`/api/post/like/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response;
  } catch (error) {
    console.error('Like Photo Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Like failed');
  }
};

export const useLikePhoto = () => {
  const queryClient = useQueryClient();
  const {userData} = useUserStore();

  return useMutation({
    mutationFn: ({photoId}: {photoId: string}) => likePhoto(photoId),

    onMutate: async ({photoId}) => {
      await queryClient.cancelQueries({queryKey: ['photo']});
      const previousSingle = queryClient.getQueryData(['photo', photoId]);

      queryClient.setQueryData(['photo', photoId], (oldData: any) => {
        if (!oldData?.video?.likes || !userData?.id) return oldData;

        const hasLiked = oldData.video.likes.some(
          (like: any) => like.userId === userData.id,
        );

        const updatedLikes = hasLiked
          ? oldData.video.likes.filter(
              (like: any) => like.userId !== userData.id,
            )
          : [
              ...oldData.video.likes,
              {
                id: 'temp-id',
                userId: userData.id,
                user: userData,
              },
            ];

        return {
          ...oldData,
          video: {
            ...oldData.video,
            likes: updatedLikes,
          },
        };
      });

      return {previousSingle};
    },

    onError: (err, {photoId}, context) => {
      if (context?.previousSingle) {
        queryClient.setQueryData(['photo', photoId], context.previousSingle);
      }
      console.error('Like Photo Error:', err);
    },

    onSuccess: (_data, {photoId}) => {
      queryClient.invalidateQueries({queryKey: ['photo', photoId]});
    },
  });
};
