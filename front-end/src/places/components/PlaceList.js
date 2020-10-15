import React from 'react';
import './PlaceList.css';
import Card from '../../shared/components/UIComponents/Card';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElement/Button';

const PlaceList = ({ items, onDeletePlaceItem }) => {
  if (items.length === 0)
  {
    return <div className="place-list center">
      <Card className="place-list__empty">
        <h2>No Places Found</h2>
        <Button to="/places/new" >Share Place</Button>
      </Card>
    </div>
  }
  return (
    <ul className="place-list">
      {
        items.map(({ id, image, title, description, address, creator, location }) => (<PlaceItem key={id}
          id={id}
          image={image}
          title={title}
          description={description}
          address={address}
          creatorId={creator}
          coordinates={location}
          onDelete={onDeletePlaceItem}
        />))
      }
    </ul>
  )
}

export default PlaceList;
