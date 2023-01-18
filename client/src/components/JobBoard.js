import JobList from './JobList';
//import {JOBS_QUERY} from './graphql/queries.js'
//import { useEffect, useState } from 'react';
//import { useQuery } from '@apollo/client';
import { useJobs } from './graphql/hooks';



function JobBoard() {

  const {jobs,loading,error} = useJobs();

  // const {data,loading,error} = useQuery(JOBS_QUERY,{
  //   fetchPolicy: 'network-only'
  // });

  //const [jobs,setJobs] = useState([]);
  //const [error,setError] = useState(false);
  // useEffect(()=>{
  //   getJobs().then((jobs)=>setJobs(jobs))
  //   .catch((err)=> {
  //     console.error(err);
  //     setError(true);
  //   });
  // },[]);

  console.log(' Job Board ', {jobs,loading,error})
  if(loading){
    return <p> Loading...</p>
  }
  if(error){
    return <p> Sorry, something went wrong</p>
  }
  //const {jobs} = data;
  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default JobBoard;
