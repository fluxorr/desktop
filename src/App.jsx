import "./App.css";
import WallPaper from "./components/WallPaper";
import Photos from "./components/Photos";
import Icons from "./components/Icons";
import Calculator from "./components/Calculator";
import Notepad from "./components/NotePad";

function App() {
  return (
    <div>
      <Calculator></Calculator>
      <Icons></Icons>
      <WallPaper></WallPaper>
      <Photos></Photos>
      <Notepad></Notepad>
    </div>
  );
}

export default App;
