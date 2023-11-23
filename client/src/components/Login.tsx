import { useUserContext } from '../context/user-context';
import { customFetch } from '../utils/customFetch';
import './Login.css';
import { XMarkIcon } from './icons';
import axios from 'axios';
// import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from './icons';
// import { useTasksContext } from '../context/tasks-context';
// import { v4 as uuidv4 } from 'uuid';
// import { useAddTaskForm } from '../hooks/UseAddTaskForm';
// import { useAddTaskOperation } from '../hooks/UseAddTaskOperation';
// import { OperationType } from '../hooks/UseAddTaskOperation';
import { FormEvent } from 'react';
import { toast } from 'react-toastify';

interface Props {
	LoginIn: boolean;
	setLoginIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Login({ LoginIn, setLoginIn }: Props) {
	const { setIsLoggedIn } = useUserContext();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const data = Object.fromEntries(formData);
		try {
			await customFetch.post('/auth/login', data);
			setIsLoggedIn(true);
			toast.success('Login succeded');
			setLoginIn(false);
		} catch (error) {
			const message = axios.isAxiosError(error)
				? error.response?.data.msg
				: 'An error has ocurred';
			toast.error(message);
		}
	};

	return (
		<div className='add-task' style={{ top: LoginIn ? '50%' : '-50%' }}>
			<div className='add-task-exit' onClick={() => setLoginIn(false)}>
				<XMarkIcon className='add-task-exit-button' />
			</div>
			<h2 className='add-task-title'>Log In</h2>
			<form onSubmit={handleSubmit}>
				<div className='login-input'>
					<label htmlFor='email'>Email:</label>
					<input type='text' name='email' id='email' autoComplete='off' />
				</div>
				<div className='login-input'>
					<label htmlFor='password'>Password:</label>
					<div>
						<input
							type='password'
							name='password'
							id='password'
							autoComplete='off'
						/>
					</div>
				</div>
				<button className='add-task-submit' type='submit'>
					Log In
				</button>
			</form>
		</div>
	);
}
