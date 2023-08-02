import React, { createContext, useReducer, useState } from "react";

export const ApiContext = createContext();

const apiReducer = (state, action) => {
    switch (action.type) {
      case 'SET_APP_ID':
        return { ...state, appId: action.payload };
      case 'SET_APPLICATION_DATA':
        return { ...state, applicationData: action.payload };
      case 'SET_ALL_APPLICATIONS_DATA':
        return { ...state, allApplicationsData: action.payload };
      default:
        return state;
    }
  };
  
  const initialState = {
    API_URL: "http://localhost:7101/ApplicatioRequest/",
    allApplicationsData: [],
    applicationData: [],
    appId: null,
  };

const SET_APP_ID = "SET_APP_ID";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_ALL_APPLICATIONS_DATA = "SET_ALL_APPLICATIONS_DATA";
  
const ApiProvider = ({ children }) => {

  const [state, dispatch] = useReducer(apiReducer, initialState);  
  const { API_URL, allApplicationsData, applicationData, appId } = state;

  const SetData = (action, payload) => {
    dispatch({type: action, payload: payload});
  }

  const GetApplication = async () => {

    if(appId === '' || appId == undefined) {
        SetData(SET_APPLICATION_DATA, undefined);
        return;
    }

    try {
      const response = await fetch(API_URL + "Get/" + appId, {
        method: "GET",
      });

      const data = await response.text();

      try {
        const json = JSON.parse(data);
        SetData(SET_APPLICATION_DATA, json);

      } catch (error) {
        console.error("Error parsing JSON:", error);
      }

      console.log("api response:", data);

    } catch (error) {
      console.error("Fetch error:", error);
    }
  };


  const GetAllApplication = async () => {

    try {
      const response = await fetch(API_URL + "GetAll", {
        method: "GET",
      });

      const data = await response.text(); 
      
      try {

        const json = JSON.parse(data);
        SetData(SET_ALL_APPLICATIONS_DATA, json);

      } catch (error) {

        console.error("Error parsing JSON:", error);
      }

      console.log("api response:", data);

    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const AddUpdateApplication = async (application, isNew) => {

    try {
        const response = await fetch(API_URL + (isNew ? "Add" : "Update"), {
          method: isNew ? "POST" : "PUT", 
          headers: {
            "Content-Type": "application/json", // Set the Content-Type header to indicate JSON data
          },
          body: JSON.stringify(application)
        });

        return response.ok;
  
      } catch (error) {
        console.error("Fetch error:", error);
      }
  }

  const DeleteApplication = async (applicationId) => {

    try {
        const response = await fetch(API_URL + "Delete/" + applicationId, {
          method: "DELETE", 
          headers: {
            "Content-Type": "application/json", // Set the Content-Type header to indicate JSON data
          }
        });

        return response.ok;
  
      } catch (error) {
        console.error("Fetch error:", error);
      }
  }

  return (
    <ApiContext.Provider
      value={{
        SetApplicationId : (applicationId) => SetData(SET_APP_ID, applicationId),
        allApplicationsData,
        applicationData,
        GetAllApplication,
        GetApplication,
        AddUpdateApplication,
        DeleteApplication,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;
