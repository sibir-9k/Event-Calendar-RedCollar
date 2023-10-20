import { Calendar } from '../widgets/calendar/Calendar';
import { Header } from '../shared/ui/header/Header';
import './index.css';

function App() {
	return (
		<div className="app">
			<Header />
			<Calendar
        title={''}
        extendedProps={{
          location: '',
          dateStart: '',
          description: '',
          participants: [],
          photos: [],
        }}
        id: String id={'0'}			/>
		</div>
	);
}

export default App;
