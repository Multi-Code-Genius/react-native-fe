import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '../../hooks/api';

export const imageuploading = async (id: string, payload: any) => {
  console.log('payload', payload);

  const response = await api(`/api/user/upload-profile/${id}`, {
    method: 'POST',
    body: payload,
  });

  return response;
};

export const useUploadImage = (
  onSuccess?: (response: any) => void,
  onError?: (error: any) => void,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, payload}: {id: string; payload: FormData}) =>
      imageuploading(id, payload),

    onSuccess: data => {
      queryClient.invalidateQueries({queryKey: ['profile']});

      if (onSuccess) {
        onSuccess(data);
      }
    },

    onError,
  });
};
