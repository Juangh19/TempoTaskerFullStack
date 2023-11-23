import { useEffect, useState } from 'react';
import './App.css';
import { DoingColumn } from './components/mainTable/DoingColumn';
import { DoneColumn } from './components/mainTable/DoneColumn';
import { Header } from './components/Header';
import { ToDoColumn } from './components/mainTable/ToDoColumn';
import { AddTask } from './components/AddTask';
import { useTasksContext } from './context/tasks-context';
import { Timer } from './components/Timer';
import { Footer } from './components/Footer';
import { Login } from './components/Login';
import { useUserContext } from './context/user-context';
import { customFetch } from './utils/customFetch';
import { Register } from './components/Register';

function App() {
	const [addingTask, setAddingTask] = useState(false);
	const [loginIn, setLoginIn] = useState(false);
	const [signUp, setSignUp] = useState(false);
	const { setIsLoggedIn } = useUserContext();

	customFetch.interceptors.response.use(
		(response) => {
			return response;
		},
		(error) => {
			if (error.response?.status === 401) {
				setIsLoggedIn(false);
			}
			return Promise.reject(error);
		}
	);

	useEffect(() => {
		const checkUser = async () => {
			try {
				await customFetch.get('/users/current-user');
				setIsLoggedIn(true);
			} catch (error) {
				setIsLoggedIn(false);
			}
		};

		checkUser();
	}, []);

	const { taskDoing } = useTasksContext();

	return (
		<div className='app-container'>
			<AddTask setAddingTask={setAddingTask} addingTask={addingTask} />
			<Login setLoginIn={setLoginIn} LoginIn={loginIn} />
			<Register setLogin={setLoginIn} setSignUp={setSignUp} SignUp={signUp} />

			<Header />
			{taskDoing && <Timer />}
			<div className='table-content'>
				<ToDoColumn setAddingTask={setAddingTask} />
				<DoingColumn />
				<DoneColumn />
			</div>
			<Footer setSignUp={setSignUp} setLoginIn={setLoginIn} />
		</div>
	);
}

export default App;
