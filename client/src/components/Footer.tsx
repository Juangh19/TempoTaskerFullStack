import { toast } from 'react-toastify';
import { useUserContext } from '../context/user-context';
import { customFetch } from '../utils/customFetch';
import './Footer.css';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

export function Footer({
	setLoginIn,
	setSignUp,
}: {
	setLoginIn: React.Dispatch<React.SetStateAction<boolean>>;
	setSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { user, setIsLoggedIn } = useUserContext();
	const queryClient = useQueryClient();

	const logout = async () => {
		try {
			await customFetch.get('auth/logout');
			queryClient.invalidateQueries({ queryKey: ['user'] });
			setIsLoggedIn(false);
			toast.success('Logout succeded');
		} catch (error) {
			const message = axios.isAxiosError(error)
				? error.response?.data.msg
				: 'An error has ocurred';
			toast.error(message);
		}
	};

	return (
		<footer className='footer'>
			<div className='footer-info'>
				<div className='footer-author'>
					<span>
						Developed and designed by:{' '}
						<a
							href='https://github.com/Juangh19'
							target='_BLANK'
							rel='noopener'
						>
							Juangh19
						</a>
					</span>
				</div>
				<div className='footer-about'>
					<a
						href='https://github.com/Juangh19/tempotasker'
						target='_BLANK'
						rel='noopener'
					>
						How i made this project?
					</a>
				</div>
			</div>
			<div className='footer-sign'>
				{user ? (
					<>
						<div>
							<span>{user?.username}</span>
						</div>
						<div>
							<span onClick={logout}>Logout</span>
						</div>
					</>
				) : (
					<>
						<div onClick={() => setLoginIn(true)}>
							<span>Login</span>
						</div>
						<div onClick={() => setSignUp(true)}>
							<span>Register</span>
						</div>
					</>
				)}
			</div>
		</footer>
	);
}
