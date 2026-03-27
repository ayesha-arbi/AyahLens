// If your Landing.jsx is in the exact same folder as App.jsx:
import Landing from './Screens/landing'; 

// NOTE: If you put Landing.jsx inside a 'components' folder, 
// change the line above to: import Landing from './components/Landing';

function App() {
  return (
    <>
      <Landing />
    </>
  );
}

export default App;