import { BatteryEmptyIcon, PlayIcon, XMarkIcon } from '../icons';
import './ToDoColumn.css';
import '../../variables.css';
import { Task, TaskUser, useTasksContext } from '../../context/tasks-context';
import { minutesToHours } from '../../services/minutesToHours';
import { useTimerContext } from '../../context/timer-context';
import { useUserContext } from '../../context/user-context';
import { customFetch } from '../../utils/customFetch';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const todoTaskQuery = {
	queryKey: ['tasks', 'todo'],
	queryFn: async () => {
		const { data } = await customFetch.get('/tasks', {
			params: { status: 'todo' },
		});
		return data.tasks;
	},
};

interface Props {
	setAddingTask: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ToDoColumn({ setAddingTask }: Props) {
	const { removeTask, addDoingTask, clearDoingTask } = useTasksContext();
	const { setTaskTime, setIsRunning } = useTimerContext();
	const { isLoggedIn } = useUserContext();
	const queryClient = useQueryClient();

	const { tasksToDo } = useTasksContext();

	const { data: tasksToDoUser, isLoading } = useQuery({
		...todoTaskQuery,
		enabled: isLoggedIn,
	});

	const handleRemoveTask = (task: Task) => () => {
		console.log(1);

		removeTask(task);
	};

	const handleAddDoingTask = (task: Task) => () => {
		clearDoingTask();
		addDoingTask(task);
		setTaskTime(task.duration * 60);
		setIsRunning(true);
	};

	// const handleAddDoingTaskUser = (task: TaskUser) => () => {
	// 	clearDoingTask();
	// 	setTaskDoingUser(task);
	// 	setTaskTime(task.duration * 60);
	// 	setIsRunning(true);
	// };

	const handleAddingTask = () => {
		setAddingTask(true);
	};

	return (
		<div className='todo-column'>
			<div className='title-table title-todo'>
				<BatteryEmptyIcon className='battery-icon' />
				<h2>To Do</h2>
				<hr />
			</div>
			{isLoggedIn ? (
				isLoading ? (
					<></>
				) : (
					tasksToDoUser.map((task: TaskUser) => (
						<div key={task._id} className='todo-task'>
							<div className='task-description'>
								<span className='task-name'>{task.name}</span>
								<span className='task-duration'>
									{minutesToHours(task.duration)}
								</span>
							</div>
							<div className='task-buttons'>
								<div
									className='play-todo-button'
									onClick={async () => {
										try {
											await customFetch.put(`/tasks/${task._id}`, {
												name: task.name,
												duration: task.duration,
												status: 'doing',
											});
											queryClient.invalidateQueries({ queryKey: ['tasks'] });
										} catch (error) {
											const message = axios.isAxiosError(error)
												? error.response?.data.msg
												: 'An error has ocurred';
											toast.error(message);
										}
									}}
								>
									<PlayIcon />
								</div>
								<div
									className='remove-todo-button'
									onClick={async () => {
										try {
											await customFetch.delete(`/tasks/${task._id}`);
											queryClient.invalidateQueries({ queryKey: ['tasks'] });
											toast.success('Task removed successfully');
										} catch (error) {
											const message = axios.isAxiosError(error)
												? error.response?.data.msg
												: 'An error has ocurred';
											toast.error(message);
										}
									}}
								>
									<XMarkIcon />
								</div>
							</div>
						</div>
					))
				)
			) : (
				tasksToDo.map((task) => (
					<div key={task.id} className='todo-task'>
						<div className='task-description'>
							<span className='task-name'>{task.name}</span>
							<span className='task-duration'>
								{minutesToHours(task.duration)}
							</span>
						</div>
						<div className='task-buttons'>
							<div
								className='play-todo-button'
								onClick={handleAddDoingTask(task)}
							>
								<PlayIcon />
							</div>
							<div
								className='remove-todo-button'
								onClick={handleRemoveTask(task)}
							>
								<XMarkIcon />
							</div>
						</div>
					</div>
				))
			)}
			<div className='add-task-button'>
				<span onClick={handleAddingTask}>Add a task!</span>
			</div>
		</div>
	);
}
