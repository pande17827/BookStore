import Home from "./pages/Home"
import Footer from "./components/Footer/Footer"
import Navbar from "./components/Navbar/Navbar"


function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">
      Hello world!
    </h1>
      <Navbar></Navbar>
      <Home></Home>
      <Footer></Footer>
    </>
  )
}

export default App
