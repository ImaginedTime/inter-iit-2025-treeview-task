"use client";
import { useUserContext } from "@/context/UserContext";
import React, { useEffect } from "react";
import ItemCard from "@/components/ItemCard";
import { useRouter } from "next/navigation";

import SideBar from "@/components/SideBar";

export default function Page() {
	const {
		selectedItem: item,
		setSelectedItem,
		isLoggedIn,
	} = useUserContext();

	const router = useRouter();

	useEffect(() => {
		if (!isLoggedIn) {
			router.push("/login");
		}
	}, [isLoggedIn]);

	return (
		<div className="block md:flex text-gray-700">
			<SideBar />

			<div className="p-4 md:p-8 flex-1 bg-[#f5f5f7] text-gray-800 z-20">
				{item ? (
					<ItemCard item={item} setSelectedItem={setSelectedItem} />
				) : (
					<div className="text-center text-gray-500">
						<p className="text-xl">
							Please select an item from the list.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
