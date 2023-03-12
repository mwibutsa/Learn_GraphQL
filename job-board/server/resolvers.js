import { Job, Company } from './db.js';
function rejectIf(condition) {
  if (condition) {
    throw new Error('Unauthorized');
  }
}
export const resolvers = {
  Query: {
    jobs: () => Job.findAll(),
    job: (_, { id }) => Job.findById(id),
    company: (_, { id }) => Company.findById(id),
  },
  Mutation: {
    createJob: (_, { input }, { user }) => {
      rejectIf(!user);
      return Job.create({ ...input, companyId: user.companyId });
    },
    deleteJob: (_, { id }) => Job.delete(id),
    updateJob: (_, { input }) => Job.update(input),
  },
  Job: {
    company: ({ companyId }) => Company.findById(companyId),
  },
  Company: {
    jobs: (company) => Job.findAll((job) => job.companyId === company.id),
  },
};
