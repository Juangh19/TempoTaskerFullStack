import './Header.css';
import '../variables.css';
import { useTasksContext } from '../context/tasks-context';

export function Header() {
	const { taskDoing } = useTasksContext();

	return (
		<>
			<header
				onClick={() => {
					fetch('/api/v1/tasks')
						.then((res) => res.json())
						.then((data) => console.log(data));
				}}
				className={taskDoing ? 'header is-running' : 'header'}
			>
				<h1 className='title'>TempoTasker</h1>
				<p className='quote'>
					“ Well-invested free time is the key to personal greatness. ”
				</p>
			</header>
		</>
	);
}
