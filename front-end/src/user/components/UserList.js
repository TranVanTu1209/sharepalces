import React from 'react';
import './UserList.css';
import UserItem from './UserItem';
import Card from '../../shared/components/UIComponents/Card';

const UserList = ({ items }) => {
  if (items.length === 0) 
  {
    return <div className="center">
      <Card>
        <h2 style={{ padding: '25px' }}>
          No Users Was Found
        </h2>
      </Card>
    </div>
  }
  return (
    <ul className="user-list">
      {
        items.map(user => (<UserItem key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length} />))
      }
    </ul>
  )
};

export default UserList;
