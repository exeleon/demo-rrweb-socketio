import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Reporter from "../../common/libs/reporter";
import { Button } from "@mui/material";
import "./app.css";

const SESSION_ID = uuidv4();

function App() {
  const [counter, setCounter] = useState(0);
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    Reporter.init({ sessionId: SESSION_ID });
  }, []);

  return (
    <div className="main-app" style={{ backgroundColor: color }}>
      <div className="content">
        <span>{counter}</span>
        <Button variant="contained" onClick={() => setCounter(counter + 1)}>
          Increment
        </Button>
        <Button
          variant="contained"
          onClick={() =>
            setColor("#" + Math.floor(Math.random() * 16777215).toString(16))
          }
        >
          Change color
        </Button>
      </div>
    </div>
  );
}

export default App;
