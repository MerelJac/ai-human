import React from 'react';
import useFetch from '../hooks/useFetch';

function Test() {
    const {loading, error, data} = useFetch('http://localhost:8080/api/chats/');

    if (loading) return (<p>loading...</p>);
    if (error) return (<p>error...</p>)


  return (
    <div>
      <p>Homepage</p>
      <div>{data}
    </div>
    </div>
  )
}

export default Test;