import { BatteryHalfIcon } from '../icons';
import './DoingColumn.css';
import { useTasksContext } from '../../context/tasks-context';
import { useTimerContext } from '../../context/timer-context';
import { customFetch } from '../../utils/customFetch';
import { useEffect } from 'react';
import { useUserContext } from '../../context/user-context';
import { useQuery } from '@tanstack/react-query';

const doingTaskQuery = {
	queryKey: ['tasks', 'doing'],
	queryFn: async () => {
		const { data } = await customFetch.get('/tasks', {
			params: { status: 'doing' },
		});
		return data.tasks;
	},
};

export function DoingColumn() {
	const { progress, setTaskTime, setIsRunning } = useTimerContext();
	const { taskDoing, clearDoingTask, setTaskDoingUser } = useTasksContext();
	const { isLoggedIn } = useUserContext();

	const { data: taskDoingUser } = useQuery({
		...doingTaskQuery,
		enabled: isLoggedIn,
	});

	useEffect(() => {
		if (taskDoingUser && taskDoingUser.length > 0) {
			clearDoingTask();
			setTaskDoingUser(taskDoingUser[0]);
			setTaskTime(taskDoingUser[0].duration * 60);
			setIsRunning(true);
		} else {
			setTaskDoingUser(undefined);
		}
	}, [taskDoingUser]);

	return (
		<div className='doing-column'>
			<div
				className='title-table title-doing'
				style={{
					borderBottom: taskDoing
						? 'none'
						: '1px solid var(--white-color-text)',
				}}
			>
				<BatteryHalfIcon className='battery-icon' />
				<h2>Doing</h2>
				{/* agregar border-bottom y hr al agregar task */}
				{taskDoing && <hr />}
			</div>
			{taskDoing && (
				<div className='doing-task'>
					<span className='doing-task-name'>{taskDoing.name}</span>
					<progress
						className='progress-bar'
						value={progress}
						max='100'
					></progress>
				</div>
			)}
		</div>
	);
}
