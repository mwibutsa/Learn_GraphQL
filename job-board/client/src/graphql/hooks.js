import { useQuery, useMutation } from '@apollo/client';
import {
  COMPANY_QUERY,
  JOBS_QUERY,
  JOB_QUERY,
  CREATE_JOB_MUTATION,
} from './queries';
import { getAccessToken } from '../auth';
export function useJob(id) {
  const { data, loading, error } = useQuery(JOB_QUERY, {
    variables: { id },
  });

  return {
    job: data?.job,
    loading,
    error: Boolean(error),
  };
}

export function useJobs() {
  const { data, loading, error } = useQuery(JOBS_QUERY, {
    fetchPolicy: 'network-only',
  });

  return {
    jobs: data?.jobs,
    loading,
    error: Boolean(error),
  };
}
export function useCreateJob() {
  const [mutate, { loading, error }] = useMutation(CREATE_JOB_MUTATION);

  return {
    loading,
    error: Boolean(error),
    createJob: async (input) => {
      const {
        data: { job },
      } = await mutate({
        variables: { input },
        context: {
          headers: {
            Authorization: 'Bearer ' + getAccessToken(),
          },
        },
        update: (cache, { data: { job } }) => {
          cache.writeQuery({
            query: JOB_QUERY,
            variables: { id: job.id },
            data: { job },
          });
        },
      });
      return job;
    },
  };
}
export function useCompany(id) {
  const { data, loading, error } = useQuery(COMPANY_QUERY, {
    fetchPolicy: 'network-only',
    variables: { id },
  });

  return {
    company: data?.company,
    loading,
    error: Boolean(error),
  };
}
