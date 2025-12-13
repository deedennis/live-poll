import React from 'react'
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { addToBookmarkService } from '../services/addToBookmarkService';
import useUserStore from '../store/useStore';

function useBookmark() {
    const queryClient = useQueryClient();
    const { setUser } = useUserStore();

    const BookmarkMutation = useMutation(addToBookmarkService, {
        onSuccess: (data) => {
          toast.success(data?.message);
          // Update user store with new bookmark data
          if (data?.data) {
            setUser(data.data);
          }
          // Invalidate bookmarks query to refetch
          queryClient.invalidateQueries(['bookmarks']);
        },
        onError: (error) => {
          console.log(error);
          toast.error(
            error?.response?.data?.message || "An unexpected error occurred"
          );
        },
      })

      const handleBookmark = async (pollId) => {
        BookmarkMutation.mutate(pollId);
      }


    return {handleBookmark, BookmarkMutation};
}

export default useBookmark
