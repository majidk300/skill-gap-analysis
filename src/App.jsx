import { BrowserRouter, Routes, Route } from "react-router-dom";

import SkillGapDiagnosisTool from "./component/SkillGapDiagnosisTool";
import Header from "./component/Header";
import Home from "./component/Home";
import Login from "./component/Login";
import Signup from "./component/Signup";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/skillgap" element={<SkillGapDiagnosisTool />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
