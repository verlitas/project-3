import React, { Component, useState, useReducer } from "react";
import { Auth } from "aws-amplify";
import { FaSignOutAlt } from "react-icons/fa";
import "./Nav.css";

import { useStoreContext } from "../../utils/Store";

function signOut() {
    Auth.signOut()
        .then(data => {
            console.log("signed out: ", data);
        })
        .catch(err => console.log(err));
}

function Nav(props) {

    const [state, dispatch] = useStoreContext();

    return (
        <nav className="nav" onClick={() => props.updateFormState("base")}>
            <h1 style={styles.navTitle}>Web Space</h1>
            {state.user && state.user.signInUserSession && (
                <div>
                    <h4 style={styles.navGreet}>Welcome {state.user.signInUserSession.idToken.payload.name}</h4>
                    <button style={styles.navSignOut} onClick={signOut}>
                        <FaSignOutAlt color="grey" />
                        <p className="text">Sign Out</p>
                    </button>
                </div>
            )}
        </nav>
    );
}
export default Nav;
