import {Job,Company} from './db.js'

function rejectIf(condition){
    if(condition){
        throw new Error('Unauthorized');
    }  
}

export const resolvers = {
    Query: {
        //First parameter is Parent , in this case - root
        job: (_root,args) =>{
            console.log('Args : ', args);
            return Job.findById(args.id);
        },
        jobs: () => Job.findAll(),
        //Fetch company detals by id
        company:(_root,{id}) =>{
            return Company.findById(id)
        }
    },

    Mutation:{
        //createJob:(_root,args) -> Can either use this or list out the
        //arguments as below
        //context argument - contains any additional peroperties to be available the resolver
        //use context to extract information from HTTP Req and make it available to the resolver
        // we can use it to authenticate the token
        createJob:(_root,{input}, {user}) =>{
            console.log('createJob context:',user)            
            rejectIf(!user);
            return Job.create({...input,companyId:user.companyId});
            
        },
        deleteJob: async (_root,{id},{user}) => {
            console.log('deleteJob context:',user)            
            rejectIf(!user);
            const job = await Job.findById(id);
            rejectIf(job.companyId !== user.companyId)
            return Job.delete(id);
        },
        updateJob: async (_root,{input},{user}) => {
            console.log('updateJob context:',user)            
            rejectIf(!user);
            const job = await Job.findById(input.id);
            rejectIf(job.companyId !== user.companyId)
            return Job.update({...input,companyId:user.companyId});}
    },

    Job:{
        //First parameter is parent object
        company: (job) => {
            //console.log('resolving company for job', job);
            return Company.findById(job.companyId)
        }
    },
    Company:{
        //First parameter is parent object
        jobs:(company) =>{
            console.log('resolving job for company', company);
            //return Job.findById(company.id).company.jobs;
            return Job.findAll((job) => job.companyId === company.id)
        }
    }
}