import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {api} from '../../hooks/api';
import {videoStore} from '../../store/videoStore';

export const fetchPaginatedVideos = async (page: number) => {
  try {
    const response = await api(`/api/video?page=${page}`, {
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

export const useInfiniteVideos = () => {
  return useInfiniteQuery({
    queryKey: ['videos'],
    queryFn: ({pageParam = 1}) => fetchPaginatedVideos(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.videos.length < 10) return undefined;
      return allPages.length + 1;
    },
  });
};

export const fetchSingleVideo = async (id: string) => {
  const res = await api(`/api/video/${id}`, {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  });
  return res;
};

export const useVideo = (id: string) => {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => fetchSingleVideo(id),
    enabled: !!id,
  });
};

export const videoById = async (id: string) => {
  try {
    const response = await api(`/api/video/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response;
  } catch (error) {
    console.log('Get Video Error', error);
    throw new Error(error instanceof Error ? error.message : 'Video Failed');
  }
};

export const useVideoById = (id: string) => {
  return useQuery({
    queryKey: ['video', id],
    queryFn: () => videoById(id),
  });
};

export const likeVideo = async (videoId: string) => {
  try {
    const response = await api(`/api/video/like/${videoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await response;
  } catch (error) {
    console.error('Like Video Error:', error);
    throw new Error(error instanceof Error ? error.message : 'Like failed');
  }
};

export const useLikeVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({videoId}: {videoId: string}) => likeVideo(videoId),

    onMutate: async ({videoId}) => {
      await queryClient.cancelQueries({queryKey: ['videos']});

      const previousList = queryClient.getQueryData(['videos']);
      await Promise.all([
        queryClient.cancelQueries({queryKey: ['video', videoId]}),
        queryClient.cancelQueries({queryKey: ['videos']}),
      ]);

      const previousSingle = queryClient.getQueryData(['video', videoId]);

      queryClient.setQueryData(['video', videoId], (oldData: any) => {
        if (!oldData) {
          return oldData;
        }

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

        return {...oldData, likes: updatedLikes};
      });

      queryClient.setQueryData(['videos'], (oldData: any) => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            videos: page.videos.map((video: any) => {
              if (video.id !== videoId) {
                return video;
              }

              const hasLiked = video.likes?.some(
                (like: any) => like.userId === video.currentUserId,
              );

              const updatedLikes = hasLiked
                ? video.likes.filter(
                    (like: any) => like.userId !== video.currentUserId,
                  )
                : [
                    ...video.likes,
                    {
                      id: 'temp-like-id',
                      userId: video.currentUserId,
                      user: video.currentUser,
                    },
                  ];

              return {...video, likes: updatedLikes};
            }),
          })),
        };
      });

      return {previousSingle, previousList};
    },

    onError: (err, {videoId}, context: any) => {
      if (context?.previousSingle) {
        queryClient.setQueryData(['video', videoId], context.previousSingle);
      }
      if (context?.previousList) {
        queryClient.setQueryData(['videos'], context.previousList);
      }
      return console.error('Like Video Error:', err);
    },

    onSuccess: (_data, {videoId}) => {
      queryClient.invalidateQueries({queryKey: ['video', videoId]});
      queryClient.invalidateQueries({queryKey: ['videos']});
    },
  });
};

export const commentVideo = async (videoId: string, text: string) => {
  try {
    const response = await api(`/api/video/comments/${videoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({text}),
    });
    return await response;
  } catch (error) {
    console.error('comments Video Error:', error);
    throw new Error(error instanceof Error ? error.message : 'comments failed');
  }
};

export const useCommentVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({videoId, text}: {videoId: string; text: string}) =>
      commentVideo(videoId, text),

    onMutate: async ({videoId, text}) => {
      await queryClient.cancelQueries({queryKey: ['video', videoId]});

      const previous = queryClient.getQueryData(['video', videoId]);

      queryClient.setQueryData(['video', videoId], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          comments: [
            ...(oldData.comments || []),
            {
              id: 'temp-id',
              text,
              userId: oldData.currentUserId,
              user: oldData.currentUser,
            },
          ],
        };
      });

      videoStore.getState().addVideoComment(videoId, {
        id: 'temp-id',
        text,
        userId: (previous as any)?.currentUserId,
        user: (previous as any)?.currentUser,
      });

      return {previous};
    },

    onError: (err, {videoId}, context: any) => {
      if (context?.previousSingle) {
        queryClient.setQueryData(['video', videoId], context.previousSingle);
      }
      if (context?.previousList) {
        queryClient.setQueryData(['videos'], context.previousList);
      }
      return console.error('Comment Video Error:', err);
    },

    onSuccess: (_data, {videoId}) => {
      queryClient.invalidateQueries({queryKey: ['video', videoId]});
      queryClient.invalidateQueries({queryKey: ['videos']});
    },
  });
};
