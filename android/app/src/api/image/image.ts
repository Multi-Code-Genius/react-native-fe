import {useMutation} from '@tanstack/react-query';
import {api} from '../../hooks/api';

export const imageuploading = async (id: string, payload: any) => {
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
  return useMutation({
    mutationFn: ({id, payload}: {id: string; payload: FormData}) =>
      imageuploading(id, payload),
    onSuccess,
    onError,
  });
};
