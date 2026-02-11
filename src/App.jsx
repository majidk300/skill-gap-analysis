import { BrowserRouter, Routes, Route } from "react-router-dom";

import SkillGapDiagnosisTool from "./component/SkillGapDiagnosisTool";
import Header from "./component/Header";
import Home from "./component/Home";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/skillgap" element={<SkillGapDiagnosisTool />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;
