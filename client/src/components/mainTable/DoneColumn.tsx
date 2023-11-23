/* eslint-disable no-mixed-spaces-and-tabs */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Task, TaskUser, useTasksContext } from '../../context/tasks-context';
import { minutesToHours } from '../../services/minutesToHours';
import { customFetch } from '../../utils/customFetch';
import { BatteryFullIcon, CheckBadgeIcon, RefreshIcon } from '../icons';
import './DoneColumn.css';
import { useUserContext } from '../../context/user-context';

const tasksDoneQuery = {
	queryKey: ['tasks', 'done'],
	queryFn: async () => {
		const { data } = await customFetch.get('/tasks', {
			params: {
				status: 'done',
			},
		});

		return data.tasks;
	},
};

export function DoneColumn() {
	const { data: tasksDoneUser } = useQuery(tasksDoneQuery);
	console.log(tasksDoneUser);
	const { isLoggedIn } = useUserContext();
	const { addTask, clearDoneTask, tasksDone } = useTasksContext();
	const queryClient = useQueryClient();

	const handleAddTask = (task: Task) => () => {
		addTask(task);
	};

	const handleClearDoneTasks = () => {
		clearDoneTask();
	};
	const handleClearDoneTasksUser = () => {
		tasksDoneUser?.forEach(async (task: TaskUser) => {
			await customFetch.delete(`/tasks/${task._id}`);
		});
		queryClient.invalidateQueries({ queryKey: ['tasks'] });
	};

	return (
		<div className='done-column'>
			<div
				className='title-table title-done'
				style={{
					borderBottom:
						tasksDone.length > 0 ? 'none' : '1px solid var(--white-color-text)',
					borderRadius:
						tasksDone.length > 0 ? '0 0.5rem 0 0' : '0 0.5rem 0.5rem 0',
				}}
			>
				<BatteryFullIcon className='battery-icon' />
				<h2>Done</h2>
				{/* agregar border-bottom y hr al agregar task */}
				{tasksDone.length > 0 && <hr />}
			</div>
			{isLoggedIn && tasksDoneUser !== undefined ? (
				tasksDoneUser.map((task: TaskUser) => (
					<div key={task._id} className='done-task'>
						<div className='done-task-description'>
							<span className='task-name'>{task.name}</span>
							<div className='task-below-name'>
								<span className='done-task-duration'>
									{minutesToHours(task.duration)}
								</span>
								<div
									className='re-add-task'
									onClick={async () => {
										await customFetch.put(`/tasks/${task._id}`, {
											name: task.name,
											duration: task.duration,
											status: 'todo',
										});
										queryClient.invalidateQueries({ queryKey: ['tasks'] });
									}}
								>
									<RefreshIcon />
								</div>
							</div>
						</div>
						<div className='check-done-task'>
							<CheckBadgeIcon />
						</div>
					</div>
				))
			) : isLoggedIn && tasksDoneUser === undefined ? (
				<></>
			) : (
				tasksDone.map((task) => (
					<div key={task.id} className='done-task'>
						<div className='done-task-description'>
							<span className='task-name'>{task.name}</span>
							<div className='task-below-name'>
								<span className='done-task-duration'>
									{minutesToHours(task.duration)}
								</span>
								<div className='re-add-task' onClick={handleAddTask(task)}>
									<RefreshIcon />
								</div>
							</div>
						</div>
						<div className='check-done-task'>
							<CheckBadgeIcon />
						</div>
					</div>
				))
			)}
			{isLoggedIn && tasksDoneUser !== undefined ? (
				tasksDoneUser.length > 0 && (
					<div className='clear-done-task-button'>
						<span onClick={handleClearDoneTasksUser}>
							Clear done tasks user
						</span>
					</div>
				)
			) : (
				<></>
			)}
			{!isLoggedIn && tasksDone.length > 0 && (
				<div className='clear-done-task-button'>
					<span onClick={handleClearDoneTasks}>Clear done tasks</span>
				</div>
			)}
		</div>
	);
}
