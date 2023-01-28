// import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
// import { companies } from '../fake-data';
import { useCompany } from './graphql/hooks';
// import { getCompany, getJob } from './graphql/queries';
import JobList from './JobList';

function CompanyDetail() {
  //const [company,setCompany] = useState(null)
  const { companyId } = useParams();
  const {company,loading,error} = useCompany(companyId);
  // useEffect(()=>{
  //   getCompany(companyId).then(setCompany)
  // },[companyId])
  if(loading){
    return <p> Loading.. </p>
  }
  if(error){
    return <p> Sorry, something went wrong</p>
  }
  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h5 className="title is-5">
        Jobs at {company.name}       
      </h5>
      <JobList jobs={company.jobs}/>
    </div>
  );
}

export default CompanyDetail;
