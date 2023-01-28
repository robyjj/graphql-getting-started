import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { createJob, CREATE_JOB_MUTATION, JOB_QUERY } from './graphql/queries';
import { getAccessToken } from '../auth';

function JobForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mutate,{loading}] = useMutation(CREATE_JOB_MUTATION);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const {data:{job}} = await mutate(
      {
        variables:{
          input : {title,description}
        },
        context:{ 
          headers : {'Authorization':'Bearer ' + getAccessToken()},
        },
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
    //const job = await createJob({title,description})
    console.log('job created', job)
    //Route to the newly created job
    navigate(`/jobs/${job.id}`);
  };

  return (
    <div>
      <h1 className="title">
        New Job
      </h1>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">
              Title
            </label>
            <div className="control">
              <input className="input" type="text" value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">
              Description
            </label>
            <div className="control">
              <textarea className="textarea" rows={10} value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
            {/* Disabling Submit after one click */}
              <button className="button is-link"  disabled={loading} 
              onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobForm;
