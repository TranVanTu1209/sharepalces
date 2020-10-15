import { useReducer, useCallback } from 'react';

const formReducer = (state, action) => {
  switch (action.type)
  {
    case 'INPUT_CHANGE': {
      let formIsValid = true;
      for (const inputId in state.inputs)
      {
        if (!state.inputs[inputId])
        {
          continue;
        }
        if (inputId === action.inputId)
        {
          formIsValid = formIsValid && action.isValid;
        } else
        {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        formIsValid: formIsValid,
        inputs: {
          ...state.inputs,
          [action.inputId]: {
            value: action.value,
            isValid: action.isValid
          }
        }
      }
    }
    case 'SET_DATA':
      return {
        ...state,
        inputs: action.inputs,
        formIsValid: action.formIsValid
      }
    default: return state;
  }
}

export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    formIsValid: initialFormValidity
  });
  const inputHandler = useCallback(
    (id, value, isValid) => {
      dispatch({
        type: 'INPUT_CHANGE',
        value: value,
        inputId: id,
        isValid: isValid
      });
    }, []);

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity
    });
  }, []);

  return [formState, inputHandler, setFormData];
}