import React, { useState } from 'react';
import { useEffect } from 'react';
import ErrorModal from '../../shared/components/UIComponents/ErrorModal';
import LoadingSpinner from '../../shared/components/UIComponents/LoadingSpinner';
import UserList from '../components/UserList';
import { useHttpClient } from '../../shared/hooks/http-hooks/http-hooks';

const Users = () => {
  const [users, setUsers] = useState([]);
  const { isLoading, error, clearError, sendRequest } = useHttpClient();
  useEffect(() => {
    const fetchUsers = async () => {
      try
      {
        const resData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users');
        setUsers(resData.users);
      } catch (error)
      {
        console.log(error);
      }
    }
    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      {
        isLoading ? <div className="center">
          <LoadingSpinner asOverlay />
        </div> : <UserList items={users} />
      }
      {error && <ErrorModal error={error} onClear={clearError} />
      }
    </React.Fragment>
  )
}

export default Users;
