import { createContext, useContext, useEffect, useState } from 'react';
import { customFetch } from '../utils/customFetch';
import { useQuery } from '@tanstack/react-query';

const userQuery = {
	queryKey: ['user'],
	queryFn: async () => {
		const { data } = await customFetch.get('/users/current-user');

		return data.user;
	},
};

type User = {
	username: string;
};

interface UserContextType {
	user: User | null;
	isLoggedIn: boolean;
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const { data, isLoading } = useQuery({ ...userQuery, enabled: isLoggedIn });

	useEffect(() => {
		if (isLoading) {
			setUser({
				username: 'Loading...',
			});
		} else if (isLoggedIn) {
			setUser(data);
		} else {
			setUser(null);
		}
	}, [isLoggedIn, isLoading, data]);

	return (
		<UserContext.Provider value={{ user, isLoggedIn, setIsLoggedIn }}>
			{children}
		</UserContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUserContext() {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error('useUserContext must be used within a TasksContext');
	}

	return context;
}
