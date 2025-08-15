import logo from "./logo.svg";
import "./App.css";
import TodoList from "./components/TodoList";
import { TodosContext } from "./contexts/todosContext";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import MySnackBar from "./components/MySnackBar";
import { ToastProvider } from "./contexts/ToastContext";

const initialTodos = [
  {
    id: uuidv4(),
    title: "Kitap oku",
    details: "yusufadnan",
    isCompleted: false,
  },
  {
    id: uuidv4(),
    title: "Kitap oku",
    details: "yusufadnan",
    isCompleted: false,
  },
  {
    id: uuidv4(),
    title: "Kitap oku",
    details: "yusufadnan",
    isCompleted: false,
  },
];

function App() {
  const [todos, setTodos] = useState(initialTodos);

  return (
    <ToastProvider>
      <div
        className="App"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#1178d8ff",
          direction: "ltr",
        }}
      >
        <TodosContext.Provider value={{ todos, setTodos }}>
          <TodoList />
        </TodosContext.Provider>
      </div>
    </ToastProvider>
  );
}

export default App;
