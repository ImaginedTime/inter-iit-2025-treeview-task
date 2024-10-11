"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

type ItemCardProps = {
	item: ItemType;
	setSelectedItem: (item: ItemType | null) => void;
};

export default function ItemCard({ item, setSelectedItem }: ItemCardProps) {
	const [imageLoaded, setImageLoaded] = useState(false);

	useEffect(() => {
		setImageLoaded(false);
	}, [item]);

	return (
		<div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto relative">
			<button
				className="text-gray-500 hover:text-gray-700 absolute right-2 top-2"
				onClick={() => setSelectedItem(null)}
			>
				<CloseIcon />
			</button>

			<div className="flex flex-col items-center md:flex-row md:items-start gap-10">
				{/* Item Image with Skeleton Loader */}
				<div className="w-48 md:h-48 relative">
					{!imageLoaded && (
						<div className="animate-pulse bg-gray-300 w-full h-full rounded-lg"></div>
					)}
					<div
						className={`p-2 shadow-lg rounded-lg ${
							imageLoaded ? "opacity-100" : "opacity-0"
						}`}
					>
						<Image
							src={item.image_url}
							alt={item.name}
							width={192}
							height={192}
							className={`rounded-lg object-cover transition-opacity duration-300`}
							onLoadingComplete={() => setImageLoaded(true)}
						/>
					</div>
				</div>

				{/* Item Info */}
				<div className="flex flex-col text-left">
					<h1 className="text-3xl font-bold text-[#261A57]">
						{item.name}
					</h1>
					<p className="text-gray-600 mt-2">
						Category: {item.category}
					</p>
					<p className="text-gray-600">Brand: {item.brand}</p>
					<p className="text-gray-600">Status: {item.status}</p>
					<p className="text-gray-600">Quantity: {item.quantity}</p>
					<p className="text-gray-600">
						Price:{" "}
						<span className="text-green-600 font-semibold">
							${item.price}
						</span>
					</p>

					{/* Dynamically render attributes */}
					{item.attributes && (
						<div className="mt-6">
							<h2 className="text-lg font-semibold text-[#261A57]">
								Attributes:
							</h2>
							<ul className="text-gray-600 space-y-1 mt-2">
								{Object.keys(item.attributes).map((key) => (
									<li key={key}>
										<span className="font-semibold">
											{key}:
										</span>{" "}
										{/* if the type of below is a boolean, show yes or no */}
										{typeof item.attributes[key] ===
										"boolean" ? (
											item.attributes[key] ? (
												<span className="text-green-600 font-semibold">
													Yes
												</span>
											) : (
												<span className="text-red-600 font-semibold">
													No
												</span>
											)
										) : (
											item.attributes[key]
										)}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
