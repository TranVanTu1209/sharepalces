import React, { useState } from 'react';
import PlaceList from '../components/PlaceList';
import { useParams } from 'react-router-dom';
import { useHttpClient } from '../../shared/hooks/http-hooks/http-hooks';
import { useEffect } from 'react';
import LoadingSpinner from '../../shared/components/UIComponents/LoadingSpinner';
import ErrorModal from '../../shared/components/UIComponents/ErrorModal';
import Card from '../../shared/components/UIComponents/Card';

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [places, setPlaces] = useState([]);
  const userId = useParams().userId;

  useEffect(() => {
    const fetchUserPlaces = async () => {
      try
      {
        const resData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`);
        setPlaces(resData.places);
      } catch (error) { }
    }
    fetchUserPlaces();
  }, [userId, sendRequest]);

  const placeDeletedHandler = (id) => {
    setPlaces(prevPlaces => prevPlaces.filter(place => place.id !== id));
  }
  return (
    <React.Fragment>
      {
        error && <ErrorModal error={error} onClear={clearError} />
      }
      {
        isLoading && <div className="center"> <LoadingSpinner asOverlay /> </div>
      }
      {
        !isLoading && places.length > 0 ? <PlaceList items={places} onDeletePlaceItem={placeDeletedHandler} /> : <Card>
          <div className="center">
            <h2>Could not find any place</h2>
          </div>
        </Card>
      }
    </React.Fragment>
  );
}

export default UserPlaces;
