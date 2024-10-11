"use client";

import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react";

type User = {
	id: string;
	email: string;
	name: string;
};

type UserContextType = {
	isLoggedIn: boolean;
	setIsLoggedIn: (loggedIn: boolean) => void;
	user: User | null;
	setUser: (user: User | null) => void;
	selectedItem: ItemType | null;
	setSelectedItem: (item: ItemType | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [user, setUser] = useState<User | null>(null);
	const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user");

		if (token && user) {
			setIsLoggedIn(true);
			setUser(JSON.parse(user));
		}
	}, []);

	return (
		<UserContext.Provider
			value={{ isLoggedIn, setIsLoggedIn, user, setUser, selectedItem, setSelectedItem }}
		>
			{children}
		</UserContext.Provider>
	);
};

// Custom hook to use the Admin context
export const useUserContext = () => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUserContext must be used within an UserProvider");
	}
	return context;
};
