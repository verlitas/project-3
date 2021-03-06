import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import Nav from "../Nav/Nav.js";
import Buttons from "../Button/Buttons.js";
import Form from "../../Form/Form"
import { Hub, Auth } from "aws-amplify";
import { useStoreContext } from "../../utils/Store";
import API from "../../utils/API";

function Authentication(props) {
  const [formState, updateFormState] = useState("base");
  const [state, dispatch] = useStoreContext();
  const [user, setUser] = useState({})

  useEffect(() => {
    // set listener for auth events
    Hub.listen("auth", data => {
      const { payload } = data;
      if (payload.event === "signIn") {

        Auth.currentAuthenticatedUser()
          .then(data => {
            const userName = data.signInUserSession.idToken.payload.name
            const userEmail = data.signInUserSession.idToken.payload.email
            const userImage = data.signInUserSession.idToken.payload.picture
            API.getUserByEmail(userEmail).then(userExist => {
              console.log(userExist);
              //checks if user is in the data base and stores information that will be passed to the modal
              if (!userExist.data) {
                API.saveUser({
                  name: userName,
                  email: userEmail,
                  picture: userImage
                }).then(user => {
                  console.log("User Created");
                }).catch(err => {
                  console.log("User creation failed");
                });
                props.history.push("/register");
              }
              if (userExist.data) {
                API.getUserByEmail(
                  userEmail
                ).then(user => {
                  console.log("User Created");
                }).catch(err => {
                  console.log("User creation failed")
                });
                props.history.push("/main")
              }
            })
          })

        setImmediate(() => dispatch({ type: "SET_USER", user: payload.data }));
        updateFormState("base");
      }
      // this listener is needed for form sign ups since the OAuth will redirect & reload
      if (payload.event === "signOut") {
        setTimeout(() => dispatch({ type: "SET_USER", user: null }), 350);
      }
    });
    // we check for the current user unless there is a redirect to ?signedIn=true
    if (!window.location.search.includes("?signedin=true")) {
      checkUser(dispatch);
    }
  }, []);
  // This renders the custom form
  if (formState === "email") {
    return (
      <div >
        <Nav updateFormState={updateFormState} />
        <Form />
      </div>
    );
  }
  return (
    <div>
      <Nav updateFormState={updateFormState} />
      {state.loading && (
        <div className="">
          <p>Loading...</p>
        </div>
      )}
      {!state.user && !state.loading && (
        <Buttons updateFormState={updateFormState} />
      )}
    </div>
  );
}

async function checkUser(dispatch) {
  try {
    const user = await Auth.currentAuthenticatedUser();
    console.log("user: ", user);
    dispatch({ type: "SET_USER", user });
  } catch (err) {
    console.log("err: ", err);
    dispatch({ type: "LOADED" });
  }
}

export default withRouter(Authentication);