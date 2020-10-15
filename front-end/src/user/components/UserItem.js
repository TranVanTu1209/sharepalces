import React from 'react';
import { Link } from 'react-router-dom';
import './UserItem.css';
import Avatar from '../../shared/components/UIComponents/Avatar';
import Card from '../../shared/components/UIComponents/Card';
const UserItem = ({ id, name, image, placeCount }) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${id}/places`} >
          <div className="user-item__image">
            <Avatar image={`${process.env.REACT_APP_ASSET_URL}/${image}`} alt={name} />
          </div>
          <div className="user-item__info">
            <h2>
              {
                name
              }
            </h2>
            <h3>
              {placeCount} {placeCount <= 1 ? 'Place' : 'Places'}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
}

export default UserItem;
