import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Play from "./pages/Play";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play/:code" element={<Play />} />
        <Route path="/play/:code/finished" element={<div>Game Over</div>} />
      </Routes>
    </BrowserRouter>
  );
}
