import { useTasksContext } from '../context/tasks-context';
import { useTimerContext } from '../context/timer-context';
import { useUserContext } from '../context/user-context';
import { customFetch } from '../utils/customFetch';
import './Timer.css';
import { PauseIcon, PlayIcon, XMarkIcon } from './icons';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export function Timer() {
	const { timeLeft, progress, setIsRunning, isRunning } = useTimerContext();
	const { taskDoing } = useTasksContext();
	const { clearDoingTask } = useTasksContext();
	const { isLoggedIn } = useUserContext();
	const queryClient = useQueryClient();

	const hours = Math.floor(timeLeft / 3600);
	const minutes = Math.floor((timeLeft % 3600) / 60);
	const seconds = Math.floor((timeLeft % 3600) % 60);

	const handleSetIsRunning = (val: boolean) => {
		setIsRunning(val);
	};

	const handleClearDoingTask = () => {
		clearDoingTask();
	};

	return (
		<div className='timer'>
			<label
				className='label-timer-progress'
				style={{ '--p': progress } as React.CSSProperties}
			>
				<span className='timer-counter'>
					{hours < 10 ? `0${hours}` : hours}:
					{minutes < 10 ? `0${minutes}` : minutes}:
					{seconds < 10 ? `0${seconds}` : seconds}
				</span>
				<div className='timer-buttons'>
					{isRunning ? (
						<div
							className='timer-pause'
							onClick={() => handleSetIsRunning(false)}
						>
							<PauseIcon />
						</div>
					) : (
						<div
							className='timer-unpause'
							onClick={() => handleSetIsRunning(true)}
						>
							<PlayIcon className='play-timer-button' />
						</div>
					)}
					<div
						className='timer-exit'
						onClick={async () => {
							try {
								if (isLoggedIn && taskDoing) {
									const taskId =
										'id' in taskDoing ? taskDoing.id : taskDoing?._id;

									console.log(taskId);

									if (taskId) {
										await customFetch.delete(`tasks/${taskId}`);
										queryClient.invalidateQueries({ queryKey: ['tasks'] });
										toast.success('Task deleted');
									} else {
										console.error('Task ID not found');
									}
								} else {
									handleClearDoingTask();
								}
							} catch (error) {
								toast.error('Error deleting task');
							}
						}}
					>
						<XMarkIcon className='timer-exit-icon' />
					</div>
				</div>
				<progress className='timer-progress' max='100' value='10'></progress>
			</label>
		</div>
	);
}
