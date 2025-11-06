import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "./pages"
import { Submit } from "./pages"
import { Profile } from "./pages"
import { About } from "./pages"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/submit" element={<Submit />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;