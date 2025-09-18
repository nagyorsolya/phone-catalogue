import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PhoneList } from "./components/PhoneList";
import { PhoneDetail } from "./components/PhoneDetail";

function App() {
  return (
    <Router>
      <header>
        <h1>Phone Catalogue</h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<PhoneList />} />
          <Route path="/phone/:id" element={<PhoneDetail />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
