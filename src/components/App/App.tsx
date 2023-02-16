import "materialize-css/dist/css/materialize.min.css";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getData, storeData } from "../../helpers/localStorage";
import Bar from "../Bar/Bar";
import BmiForm from "../BmiForm/BmiForm";
import Info from "../Info/Info";
import "./App.css";

const App = () => {
  const initialState = () => getData("data") || [];
  const [state, setState] = useState(initialState);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    storeData("data", state);
    const date = state.map((obj: any) => obj.date);
    const bmi = state.map((obj: any) => obj.bmi);
    let newData = { date, bmi };
    setData(newData);
  }, [state]);

  const handleChange = (val: any) => {
    let heightInM = val.height / 100;
    val.bmi = (val.weight / (heightInM * heightInM)).toFixed(2);
    val.id = uuidv4();
    let newVal = [...state, val];
    let len = newVal.length;
    if (len > 7) newVal = newVal.slice(1, len);
    setState(newVal);
  };

  const handleDelete = (id: any) => {
    storeData("lastState", state);
    let newState = state.filter((i: any) => {
      return i.id !== id;
    });
    setState(newState);
  };

  const handleUndo = () => {
    setState(getData("lastState"));
  };

  return (
    <div className="container">
      <div className="row center">
        <h1 className="white-text"> BMI Tracker </h1>
      </div>
      <div className="row">
        <div className="col m12 s12">
          <BmiForm change={handleChange} />
          <Bar labelData={data.date} bmiData={data.bmi} />
          <div>
            <div className="row center">
              <h4 className="white-text">7 Day Data</h4>
            </div>
            <div className="data-container row">
              {state.length > 0 ? (
                <>
                  {state.map((info) => (
                    <Info
                      key={info.id}
                      id={info.id}
                      weight={info.weight}
                      height={info.height}
                      date={info.date}
                      bmi={info.bmi}
                      deleteCard={handleDelete}
                    />
                  ))}
                </>
              ) : (
                <div className="center white-text">No log found</div>
              )}
            </div>
          </div>
          {getData("lastState") !== null ? (
            <div className="center">
              <button className="calculate-btn" onClick={handleUndo}>
                Undo
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
