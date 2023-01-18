import {ApolloClient,gql, InMemoryCache} from '@apollo/client' //Using apollo client to send each graph ql request
//import request from 'graphql-request'
import { getAccessToken } from '../../auth';

const GRAPHQL_URL = 'http://localhost:9000/graphql';
export const client = new ApolloClient({
    uri : GRAPHQL_URL,
    cache: new InMemoryCache(),
    // defaultOptions :{
    //     query:{
    //         fetchPolicy : 'network-only'
    //     },
    //     mutate:{
    //         fetchPolicy : 'network-only'
    //     },
    //     //used for observe changes to the result
    //     watchQuery:{
    //         fetchPolicy : 'network-only'
    //     },
    // }
});

//Fragment - part of an object we can reuse in query or mutation
const JOB_DETAIL_FRAGMENT = gql`
    fragment JobDetail on Job {
        id
        title
        company {
        id
        name
        }
        description
    }
`

const JOB_QUERY = gql `
# JobQuery is a user defined query name (optional) and $id is the variable passed in
# 
   query JobQuery($id : ID!){
        job(id:$id){
           ...JobDetail
        }
    }
  ${JOB_DETAIL_FRAGMENT}
`;

export const JOBS_QUERY = gql `
        query JobsQuery{
            jobs
                {
                    id
                    title
                    company {
                        id
                        name
                    }
                }
        }
        `;

// export async function getJobs(){
//     const query = gql `
//         query JobsQuery{
//             jobs
//                 {
//                     id
//                     title
//                     company {
//                         id
//                         name
//                     }
//                 }
//         }
//     `;
//     //const result = await client.query({query});
//     //jobs = result.data.jobs;
//             // or
//     const {data: {jobs}} = await client.query({query, fetchPolicy: 'network-only'});
//     // fetchPolicy has different options   
//     // no-cache  : does not store in cache
//     // network-only : stores in cache , but always fetches from networ , might be useful if other calls want to use this cache
    


//     //Replacing below with Apollo client call
//     //const {jobs} = await request(GRAPHQL_URL,query)
//     return jobs;
// }

export async function getJob(id){

    const variables = {id};
    const {data:{job}} = await client.query({
        query:JOB_QUERY,
        variables
    });

    //const {job} = await request(GRAPHQL_URL,query,variables)
    return job;
}

export async function getCompany(id){
    const query = gql `
        query CompanyQuery($id: ID!){
            company(id:$id) {
                id
                name
                description
                jobs {
                    id
                    title
                }
            }
        }
    `;
    const variables = {id};
    const {data:{company}} = await client.query({query,variables});
    //const {company} = await request(GRAPHQL_URL,query,variables)
    //console.log('Company - ',company);
    return company;
}

export async function createJob(input){
    const mutation = gql `
        mutation CreateJob($input: CreateJobInput!){
            #We add an alias 'job' at the beginning so that the alias is returned as the object name from the server
            job: createJob(input: $input) {
                ...JobDetail
                }
        }
        ${JOB_DETAIL_FRAGMENT}
    `;
    //variables are used to pass parameters to the request
    const variables = {input};
    //use the below to pass headers
    //const headers = {'Authorization':'Bearer ' + getAccessToken()}
    const context ={
        headers : {'Authorization':'Bearer ' + getAccessToken()}
    }
    const {data :{job}} = await client.mutate({
        mutation,
        variables,
        context,
        // updating the data in the cache
        update: (cache,{data:{job}}) =>{
            cache.writeQuery({
                query: JOB_QUERY,
                variables: {id: job.id},
                data: {job},
            });
            console.log('[createJob] job', job);
        }
    });
    //const {job} = await request(GRAPHQL_URL,query,variables,headers)
    //console.log('Company - ',company);
    return job;
}
// export async function deleteJob(id){
//     const query = gql `
//         mutation deleteJob($id: ID!){
//             #We add an alias 'job' at the beginning so that the alias is returned as the object name from the server
//             job: deleteJob(id: $id) {
//                     id                   
//                 }
//         }
//     `;
//     const variables = {id};
//     const {job} = await request(GRAPHQL_URL,query,variables)//     
//     return job;
// }