import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {api} from '../../hooks/api';

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
    console.log('response=============>', response);
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
  console.log('postId', postId);
  return useQuery({
    queryKey: ['photo', postId],
    queryFn: () => fetchSinglePhoto(postId),
    enabled: !!postId,
  });
};

export const likePhoto = async (photoId: string) => {
  try {
    const response = await api(`/api/post/like/${photoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('response===>>', response);
    return await response;
  } catch (error) {
    console.error('Like Photo Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Like failed');
  }
};

export const useLikePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({photoId}: {photoId: string}) => likePhoto(photoId),

    onMutate: async ({photoId}) => {
      await queryClient.cancelQueries({queryKey: ['photo']});

      const previousList = queryClient.getQueryData(['photo']);
      const previousSingle = queryClient.getQueryData(['photo', photoId]);

      await Promise.all([
        queryClient.cancelQueries({queryKey: ['photo', photoId]}),
        queryClient.cancelQueries({queryKey: ['photo']}),
      ]);

      queryClient.setQueryData(['photo', photoId], (oldData: any) => {
        if (!oldData) return oldData;

        const hasLiked = oldData.likes?.some(
          (like: any) => like.userId === oldData.currentUserId,
        );

        const updatedLikes = hasLiked
          ? oldData.likes.filter(
              (like: any) => like.userId !== oldData.currentUserId,
            )
          : [
              ...oldData.likes,
              {
                id: 'temp-like-id',
                userId: oldData.currentUserId,
                user: oldData.currentUser,
              },
            ];

        return {
          ...oldData,
          likes: updatedLikes,
        };
      });

      queryClient.setQueryData(['photo'], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            photos: page.photos.map((photo: any) => {
              if (photo.id !== photoId) return photo;

              const hasLiked = photo.likes?.some(
                (like: any) => like.userId === photo.currentUserId,
              );

              const updatedLikes = hasLiked
                ? photo.likes.filter(
                    (like: any) => like.userId !== photo.currentUserId,
                  )
                : [
                    ...photo.likes,
                    {
                      id: 'temp-like-id',
                      userId: photo.currentUserId,
                      user: photo.currentUser,
                    },
                  ];

              return {
                ...photo,
                likes: updatedLikes,
              };
            }),
          })),
        };
      });

      return {previousSingle, previousList};
    },

    onError: (err, {photoId}, context: any) => {
      if (context?.previousSingle) {
        queryClient.setQueryData(['photo', photoId], context.previousSingle);
      }
      if (context?.previousList) {
        queryClient.setQueryData(['photo'], context.previousList);
      }
      console.error('Like Photo Error:', err);
    },

    onSuccess: (_data, {photoId}) => {
      queryClient.invalidateQueries({queryKey: ['photo', photoId]});
      queryClient.invalidateQueries({queryKey: ['photo']});
    },
  });
};
