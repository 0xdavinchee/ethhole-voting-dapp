import React from 'react';
import { Symfoni } from "./hardhat/SymfoniContext";
import Voting from './Voting';
import "react-datetime/css/react-datetime.css";

// TODO: How to listen to events from the front end?

function App() {
  return (
    <div>
      <Symfoni autoInit={true}>
        <Voting />
      </Symfoni>
    </div>
  );
}

export default App;