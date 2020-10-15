import React from 'react';
import Input from '../../shared/components/FormElement/Input';
import './PlaceForm.css';
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Button from '../../shared/components/FormElement/Button';
import { useForm } from '../../shared/hooks/form-hooks/form-hooks';
import { useHttpClient } from '../../shared/hooks/http-hooks/http-hooks';
import { AuthContext } from '../../shared/context/auth-context';
import { useContext } from 'react';
import ErrorModal from '../../shared/components/UIComponents/ErrorModal';
import LoadingSpinner from '../../shared/components/UIComponents/LoadingSpinner';
import { useHistory } from 'react-router-dom';
import ImageUpload from '../../shared/components/FormElement/ImageUpload';

const NewPlace = () => {

  const { sendRequest, clearError, isLoading, error } = useHttpClient();
  const { token } = useContext(AuthContext);
  const history = useHistory();

  const [formState, inputHandler] = useForm({
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
    address: {
      value: '',
      isValid: false
    },
    image: {
      value: null,
      isValid: false
    }
  }, false);

  const placeSubmitHandler = e => {
    e.preventDefault();
    const createPlace = async () => {
      try
      {
        const formData = new FormData();
        formData.append('title', formState.inputs.title.value);
        formData.append('image', formState.inputs.image.value);
        formData.append('description', formState.inputs.description.value);
        formData.append('address', formState.inputs.address.value);
        await sendRequest(process.env.REACT_APP_BACKEND_URL + '/places', 'POST', formData, {
          Authorization: 'Bearer ' + token
        });
        history.push('/');
      } catch (error) { }
    }
    createPlace();
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {
        isLoading && <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      }
      <form onSubmit={placeSubmitHandler} className="place-form">
        <Input
          element="input"
          label="Title"
          id="title"
          type="text"
          placeholder="Add some title..."
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title"
          onInput={inputHandler}
        />
        <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide image for the place" />
        <Input
          element="textarea"
          label="Description"
          type="textarea"
          id="description"
          placeholder="Add some description..."
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description(at least 5 characters)"
          onInput={inputHandler}
        />
        <Input
          element="input"
          label="Address"
          type="text"
          id="address"
          placeholder="Add  address..."
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address"
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.formIsValid} >
          Add Place
      </Button>
      </form>
    </React.Fragment>

  );
}

export default NewPlace;
