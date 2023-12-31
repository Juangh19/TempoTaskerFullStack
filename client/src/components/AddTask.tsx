import './AddTask.css';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from './icons';
import { useTasksContext } from '../context/tasks-context';
import { v4 as uuidv4 } from 'uuid';
import { useAddTaskForm } from '../hooks/UseAddTaskForm';
import { useAddTaskOperation } from '../hooks/UseAddTaskOperation';
import { OperationType } from '../hooks/UseAddTaskOperation';
import { useEffect, useRef } from 'react';
import { useUserContext } from '../context/user-context';
import { customFetch } from '../utils/customFetch';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';

interface Props {
	addingTask: boolean;
	setAddingTask: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AddTask({ addingTask, setAddingTask }: Props) {
	const { isLoggedIn } = useUserContext();
	const { addTask } = useTasksContext();
	const inputNameRef = useRef<HTMLInputElement | null>(null);
	const queryClient = useQueryClient();

	const {
		inputName,
		inputDuration,
		canSubmit,
		setInputDuration,
		setInputName,
		handleInputChange,
		handleNameChange,
	} = useAddTaskForm();

	const { handleOperation } = useAddTaskOperation({
		inputDuration,
		setInputDuration,
	});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.target as HTMLFormElement);

		const name = formData.get('name') as string;
		const duration = Number(formData.get('duration')) as number;

		if (name.length > 0 && duration > 0) {
			if (isLoggedIn) {
				try {
					await customFetch.post('/tasks', {
						name,
						duration,
					});
					queryClient.invalidateQueries({ queryKey: ['tasks'] });
					setAddingTask(false);
					setInputDuration(0);
					setInputName('');
					toast.success('Task added successfully');
				} catch (error) {
					const message = axios.isAxiosError(error)
						? error.response?.data.msg
						: 'An error has ocurred';
					toast.error(message);
				}
			} else {
				addTask({
					id: uuidv4(),
					name,
					duration,
					status: 'todo',
				});
				setAddingTask(false);
				setInputDuration(0);
				setInputName('');
			}
		}
	};

	useEffect(() => {
		if (addingTask) {
			inputNameRef.current?.focus();
		}
	}, [addingTask]);

	return (
		<div className='add-task' style={{ top: addingTask ? '50%' : '-50%' }}>
			<div className='add-task-exit' onClick={() => setAddingTask(false)}>
				<XMarkIcon className='add-task-exit-button' />
			</div>
			<h2 className='add-task-title'>Add a task!</h2>
			<form onSubmit={handleSubmit}>
				<div className='add-task-name'>
					<label htmlFor='name'>Task name:</label>
					<input
						ref={inputNameRef}
						type='text'
						name='name'
						id='name'
						autoComplete='off'
						value={inputName}
						onChange={handleNameChange}
					/>
				</div>
				<div className='add-task-duration'>
					<label htmlFor='duration'>How many minutes?</label>
					<div className='input-duration-cont'>
						<input
							type='number'
							name='duration'
							id='duration'
							autoComplete='off'
							value={inputDuration > 0 ? inputDuration : ''}
							onChange={handleInputChange}
							placeholder='0'
						/>
						<div className='input-duration-buttons'>
							<div
								className='increment-duration'
								onClick={() => handleOperation(OperationType.Increment)}
							>
								<ChevronUpIcon />
							</div>
							<div
								className='decrement-duration'
								onClick={() => handleOperation(OperationType.Decrement)}
							>
								<ChevronDownIcon />
							</div>
						</div>
					</div>
				</div>
				<button disabled={!canSubmit} className='add-task-submit' type='submit'>
					Add
				</button>
			</form>
		</div>
	);
}
