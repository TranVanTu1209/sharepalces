import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Input from '../../shared/components/FormElement/Input';
import Button from '../../shared/components/FormElement/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import './PlaceForm.css';
import { useForm } from '../../shared/hooks/form-hooks/form-hooks';
import Card from '../../shared/components/UIComponents/Card';
import { useHttpClient } from '../../shared/hooks/http-hooks/http-hooks';
import LoadingSpinner from '../../shared/components/UIComponents/LoadingSpinner';
import ErrorModal from '../../shared/components/UIComponents/ErrorModal';
import { useContext } from 'react';
import { AuthContext } from '../../shared/context/auth-context';

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const { isLoading, error, clearError, sendRequest } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState(null);
  const { token } = useContext(AuthContext);
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm({
    title: {
      value: '',
      isValid: true
    },
    description: {
      value: '',
      isValid: true
    }
  }, true);

  useEffect(() => {
    const fetchPlace = async () => {
      try
      {
        const resData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`)
        setLoadedPlace(resData.place);
        setFormData({
          title: {
            value: resData.place.title,
            isValid: true
          },
          description: {
            value: resData.place.description,
            isValid: true
          }
        }, true);
      } catch (error) { }
    }
    fetchPlace();
  }, [setFormData, placeId, sendRequest]);

  const submitHandler = async e => {
    e.preventDefault();
    try
    {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`, 'PATCH', JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value
      }), {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      });
      history.goBack();
    } catch (error) { }
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
        loadedPlace ? <form onSubmit={submitHandler} className="place-form">
          <Input id="title" element="input" type="text" label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title" onInput={inputHandler}
            value={loadedPlace?.title}
            valid={formState.inputs.title.isValid}
          />
          <Input id="description" element="textarea" type="textarea" label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description" onInput={inputHandler}
            value={loadedPlace?.description}
            valid={formState.inputs.description.isValid}
          />
          <Button type="submit" disabled={!formState.formIsValid} >
            Update Place
            </Button>
        </form> : <Card>
            <div className="center">
              <h2>Could not find place</h2>
            </div>
          </Card>
      }
    </React.Fragment>
  );
}

export default UpdatePlace;
