import React from 'react'
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import deletePollService from '../services/deletePollService';

function useDeletePoll(id, refetch) {
    const queryClient = useQueryClient();

    const mutation = useMutation(deletePollService, {
        onSuccess : (data) => {
          console.log(data);
          // Invalidate all poll-related queries
          queryClient.invalidateQueries(['polls']);
          queryClient.invalidateQueries(['poll']);
          if (refetch) {
            refetch();
          }
          toast.success(data?.message);
        },
        onError : (error) => {
          toast.error("An unexpected error occurred");
          console.log(error);
        }
      })

      const handleDelete = () => {
        const sure = window.confirm("Are you sure you want to delete this poll?");
        if (!sure) return;
        mutation.mutate(id);
      };

      return handleDelete;
}

export default useDeletePoll
