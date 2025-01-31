const getNonEmptyErrors = (errorsObject) => {
  return Object.fromEntries(
    Object.entries(errorsObject).filter(([key, value]) => value !== '')
  );
};

export const handleUserError = (err) => {
  const errors = { firstname: '', lastname: '', email: '', password: '' };

  if (err.code === 11000) {
   errors.email = 'Email already exist!';
   return errors.email;
  }

  if (err.name === "ValidationError") { 
    Object.values(err.errors).forEach(({ properties }) => {
    errors[properties.path] = properties.message;
  });
  } else {
    return { Success: false, Error: 'Server Error' }
  }

  return getNonEmptyErrors(errors);
}

export const handleNoteError = (err) => {
  if (!err) {
    return err;
  }

  const errors = { title: '', body: '', userId: '' };

  if (err.name === "ValidationError") { 
    Object.values(err.errors).forEach(({ properties }) => {
    errors[properties.path] = properties.message;
  });
  }

  return getNonEmptyErrors(errors);
}