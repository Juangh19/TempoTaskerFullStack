/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';
import { useTasksContext } from './tasks-context';
import { useUserContext } from './user-context';
import { customFetch } from '../utils/customFetch';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

export interface TimerContext {
	timeLeft: number;
	progress: number;
	isRunning: boolean;
	setIsRunning: (val: boolean) => void;
	setTaskTime: (time: number) => void;
}

export const TimerContext = createContext<TimerContext | null>(null);

export default function TimerContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [seconds, setSeconds] = useState<number>(0);
	const [isRunning, setIsRunning] = useState<boolean>(false);
	const [taskTime, setTaskTime] = useState<number>(1);
	const { isLoggedIn } = useUserContext();

	const { taskDoing, addDoneTask } = useTasksContext();
	const queryClient = useQueryClient();

	const progress = (seconds / taskTime) * 100;
	const timeLeft = taskTime - seconds;

	useEffect(() => {
		if (taskDoing !== undefined) {
			setIsRunning(true);
			setSeconds(0);
			setTaskTime(taskDoing.duration * 60);
		}
	}, [taskDoing]);

	useEffect(() => {
		const handleOperation = async () => {
			if (taskDoing && timeLeft <= 0) {
				setIsRunning(false);
				if (isLoggedIn && '_id' in taskDoing) {
					try {
						await customFetch.put(`/tasks/${taskDoing._id}`, {
							name: taskDoing.name,
							duration: taskDoing.duration,
							status: 'done',
						});
						queryClient.invalidateQueries({ queryKey: ['tasks'] });
						toast.success('Task done');
					} catch (error) {
						const message = axios.isAxiosError(error)
							? error.response?.data.msg
							: 'An error has ocurred';
						toast.error(message);
					}
				} else if ('id' in taskDoing) {
					addDoneTask(taskDoing);
				}
			}
		};
		handleOperation();
	}, [timeLeft, addDoneTask, taskDoing, isLoggedIn, queryClient]);

	useEffect(() => {
		if (isRunning) {
			const timer = setInterval(() => {
				setSeconds((prevSeconds) => prevSeconds + 1);
			}, 10);

			return () => clearInterval(timer);
		}
	}, [isRunning]);

	return (
		<TimerContext.Provider
			value={{ timeLeft, progress, setTaskTime, setIsRunning, isRunning }}
		>
			{children}
		</TimerContext.Provider>
	);
}

export function useTimerContext() {
	const context = useContext(TimerContext);

	if (!context) {
		throw new Error('useTimerContext must be used within a TimerContext');
	}
	return context;
}
