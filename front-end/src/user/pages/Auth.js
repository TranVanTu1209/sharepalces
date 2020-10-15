import React, { useState, useContext } from 'react';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators';
import Input from '../../shared/components/FormElement/Input';
import Button from '../../shared/components/FormElement/Button';
import './Auth.css';
import { useForm } from '../../shared/hooks/form-hooks/form-hooks';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIComponents/ErrorModal';
import LoadingSpinner from '../../shared/components/UIComponents/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hooks/http-hooks';
import ImageUpload from '../../shared/components/FormElement/ImageUpload';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [loginMode, setLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: '',
      isValid: false
    },
    password: {
      value: '',
      isValid: false
    }
  }, false);

  const switchModeHandler = () => {
    if (!loginMode)
    {
      setFormData({
        name: undefined,
        image: undefined,
        ...formState.inputs
      }, formState.inputs.email.isValid && formState.inputs.password.isValid)
    } else
    {
      setFormData({
        ...formState.inputs,
        name: { value: '', isValid: false },
        image: {
          value: null,
          isValid: false
        }
      }, false);
    }
    setLoginMode(!loginMode);
  }
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loginMode)
    {
      try
      {
        const resData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users/login', 'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );
        auth.login(resData.userId, resData.token);
      } catch (error)
      {
        // console.log(error);
      }
    } else
    {
      try
      {
        const formData = new FormData();
        formData.append('name', formState.inputs.name.value);
        formData.append('email', formState.inputs.email.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);
        const res = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users/signup', 'POST', formData);
        auth.login(res.userId, res.token);
      } catch (error)
      {
        // console.log(error);
      }
    }
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <div className="auth-form">
        {
          isLoading && <div className="center">
            <LoadingSpinner asOverlay />
          </div>
        }
        <form onSubmit={onSubmitHandler} >
          {
            !loginMode ? <h2>Create New Account</h2> : <h2> Login Required </h2>
          }
          {
            !loginMode && <Input
              element="input" id="name" label="Your name" type="text" validators={[VALIDATOR_REQUIRE()]}
              placeholder="Enter your user name"
              errorText="Please fill out valid user name"
              value={formState.inputs.name?.value}
              onInput={inputHandler}
            />
          }
          {
            !loginMode && <ImageUpload id="image" onInput={inputHandler} center errorText="Please upload an image for user avatar" />
          }
          <Input label="Email" type="email" element="input" id="email"
            placeholder="Enter your email" onInput={inputHandler} value={formState.inputs.email?.value}
            errorText="Please fill out valid email"
            validators={[VALIDATOR_EMAIL()]}
          />
          <Input label="Password" type="password" element="input" id="password"
            placeholder="Enter your password" onInput={inputHandler} value={formState.inputs.password?.value}
            errorText="Please fill out valid password, at least 8 characters"
            validators={[VALIDATOR_MINLENGTH(8)]}
          />

          <Button type="submit" disabled={!formState.formIsValid} >
            {loginMode ? 'Login' : 'Sign Up'}
          </Button>
        </form>
        <br />
        <Button inverse onClick={switchModeHandler} >
          Switch To  {loginMode ? 'Sign Up' : 'Login'}
        </Button>
      </div>
    </React.Fragment>

  );
}

export default Auth;
