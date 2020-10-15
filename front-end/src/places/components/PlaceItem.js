import React, { useState, useContext } from 'react';
import Card from '../../shared/components/UIComponents/Card';
import './PlaceItem.css';
import Button from '../../shared/components/FormElement/Button';
import Modal from '../../shared/components/UIComponents/Modal';
import Map from '../../shared/components/UIComponents/Map';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hooks/http-hooks';
import ErrorModal from '../../shared/components/UIComponents/ErrorModal';
import LoadingSpinner from '../../shared/components/UIComponents/LoadingSpinner';

const PlaceItem = ({ id, image, title, address, description, coordinates, creatorId, onDelete }) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showMap, setShowMap] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const showDeleteWarning = () => setShowDelete(true);
  const cancelDeleteHandler = () => setShowDelete(false);

  const confirmDeleteHandler = async () => {
    setShowDelete(false);
    try
    {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${id}`, 'DELETE', null, {
        Authorization: 'Bearer ' + auth.token
      });
      onDelete(id);
    } catch (error) { }
  }
  return (
    <React.Fragment>
      {
        error && <ErrorModal error={error} onClear={clearError} />
      }

      <li className="place-item">
        {
          isLoading && <div className="center"> <LoadingSpinner asOverlay /> </div>
        }
        <Card className="place-item__content" >
          <div className="place-item__image">
            <img src={`${process.env.REACT_APP_ASSET_URL}/${image}`} alt={title} />
          </div>
          <div className="place-item__info">
            <h2>
              {title}
            </h2>
            <h3>
              {address}
            </h3>
            <p>
              {description}
            </p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler} >
              View On Map
            </Button>
            {auth.isLoggedin && auth.userId === creatorId && <Button to={`/places/${id}`}>Edit</Button>}
            {auth.isLoggedin && auth.userId === creatorId && <Button danger onClick={showDeleteWarning} >Delete</Button>}
          </div>
        </Card>
      </li>
      <Modal show={showMap} onCancel={closeMapHandler}
        header={address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}> CLOSE </Button>}>
        <div className="map__container" >
          <Map center={coordinates} zoom={8} />
        </div>
      </Modal>
      <Modal
        show={showDelete}
        header="Are you sure"
        footerClass="place-item__modal-actions" footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler} >
              Cancel
            </Button>
            <Button danger onClick={confirmDeleteHandler} >
              Delete
            </Button>
          </React.Fragment>}>
        <p>
          Do you want to proceed to delete this place? This can not be undone there after!!!
        </p>
      </Modal>
    </React.Fragment>
  );
}

export default PlaceItem;
