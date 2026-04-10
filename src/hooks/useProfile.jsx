import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../services/userService';

export const PROFILE_KEY = ['profile'];

const useProfile = () => {
  const queryClient = useQueryClient();

  const {
    data: profile = null,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: PROFILE_KEY,
    queryFn: () => userService.getMyProfile().then((d) => d.user ?? d),
    staleTime: 1000 * 60 * 5,
  });

  const error = queryError?.error ?? queryError?.message ?? null;

  const mergeProfile = (data) =>
    queryClient.setQueryData(PROFILE_KEY, (prev) => ({ ...(prev ?? {}), ...(data.user ?? data) }));

  const updateMutation = useMutation({
    mutationFn: userService.updateMyProfile,
    onSuccess: mergeProfile,
  });

  const changePasswordMutation = useMutation({
    mutationFn: userService.changePassword,
  });

  const deleteMutation = useMutation({
    mutationFn: userService.deleteMyProfile,
    onSuccess: () => queryClient.setQueryData(PROFILE_KEY, null),
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('avatar', file);
      return userService.updateAvatar(formData);
    },
    onSuccess: (data) =>
      queryClient.setQueryData(PROFILE_KEY, (prev) => ({
        ...(prev ?? {}),
        avatar_url: data.avatar_url ?? data.user?.avatar_url,
      })),
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: userService.deleteAvatar,
    onSuccess: () =>
      queryClient.setQueryData(PROFILE_KEY, (prev) =>
        prev ? { ...prev, avatar_url: null } : prev
      ),
  });

  return {
    profile,
    loading,
    error,
    fetchProfile: () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY }),
    updateProfile: updateMutation.mutateAsync,
    changePassword: changePasswordMutation.mutateAsync,
    deleteProfile: deleteMutation.mutateAsync,
    updateAvatar: updateAvatarMutation.mutateAsync,
    deleteAvatar: deleteAvatarMutation.mutateAsync,
    clearError: () => {},
  };
};

export default useProfile;