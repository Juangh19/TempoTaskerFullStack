import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import TasksContextProvider from './context/tasks-context.tsx';
import TimerContextProvider from './context/timer-context.tsx';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { UserContextProvider } from './context/user-context.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
		},
	},
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<UserContextProvider>
			<TasksContextProvider>
				<TimerContextProvider>
					<App />
					<ToastContainer position='top-center' />
				</TimerContextProvider>
			</TasksContextProvider>
		</UserContextProvider>
	</QueryClientProvider>
);
