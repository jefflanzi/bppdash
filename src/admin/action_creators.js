// Views
export const setView = (view) => {
  return {
    type: 'SET_VIEW',
    activeView: view
  }

// Shared Actions
export const getUsers = () => {
  return {
    type: 'GET_USERS',
    status: 'success',
    response: {}
  }
}

// GET_SURVEYS

// User View
export const createUser = (newUser) => {
  return {
    type: 'CREATE_USER',
    newUser
  }
}

export const updateUser = (user) => {
  return {
    type: 'UPDATE_USER',
    user
  }
}

export const deleteUser = (id) => {
  return {
    type: 'DELETE_USER',
    id
  }
}

// Survey View
// CREATE_SURVEY
// UPDATE_SURVEY
// DELETE_SURVEY
// UPLOAD_SURVEY_DATA

// Chart View
// GET_CHARTS
// CREATE_CHART
// UPDATE_CHART
//   UPLOAD_SURVEY_DATA
// DELETE_CHART
