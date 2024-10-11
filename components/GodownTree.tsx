"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view";
import { useUserContext } from "@/context/UserContext";

import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import UnfoldLessOutlinedIcon from "@mui/icons-material/UnfoldLessOutlined";
import UnfoldMoreOutlinedIcon from "@mui/icons-material/UnfoldMoreOutlined";

export default function GodownTree({ closeMenu }: { closeMenu: () => void }) {
	const [godowns, setGodowns] = useState<GodownType[]>([]);
	const [items, setItems] = useState<ItemType[]>([]);

	const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

	const { selectedItem, setSelectedItem } = useUserContext();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const godowns = localStorage.getItem("godowns");
				const items = localStorage.getItem("items");
				if (godowns && items) {
					setGodowns(JSON.parse(godowns));
					setItems(JSON.parse(items));
				}
			} catch (error) {
				console.error(
					"Error fetching godowns and items from local storage",
					error
				);
			}

			try {
				const response = await axios.get("/api/godowns");
				setGodowns(response.data);

				// store the godowns in local storage
				localStorage.setItem("godowns", JSON.stringify(response.data));
			} catch (error) {
				console.error("Error fetching godowns", error);
			}

			try {
				const response = await axios.get("/api/items");
				setItems(response.data);

				// store the items in local storage
				localStorage.setItem("items", JSON.stringify(response.data));
			} catch (error) {
				console.error("Error fetching items", error);
			}
		};

		fetchData();
	}, []);

	const renderTree = (godown: GodownType) => {
		const godownItems = items.filter(
			(item) => item.godown_id === godown.id
		);

		return (
			<TreeItem
				key={`godown-${godown.id}`} // Ensure godown has a unique key and id
				itemId={`godown-${godown.id}`} // Ensure unique id by prefixing with godown-
				label={
					<div>
						<FolderOpenOutlinedIcon className="mr-2" />
						<span>{godown.name}</span>
					</div>
				}
			>
				{godownItems.map((item) => (
					<TreeItem
						key={`item-${item.item_id}`} // Ensure item has a unique key
						itemId={`item-${item.item_id}`} // Ensure item has a unique id
						label={
							<div>
								<DescriptionOutlinedIcon className="mr-2" />
								<span>{item.name}</span>
							</div>
						}
						onClick={() => {
							closeMenu();
							setSelectedItem(item);
						}}
						className={
							selectedItem?.item_id === item.item_id
								? "text-[#261A57] rounded-md"
								: ""
						}
					/>
				))}
				{godowns
					.filter((g) => g.parent_godown_id === godown.id)
					.map((subGodown) => renderTree(subGodown))}
			</TreeItem>
		);
	};

	const handleExpandedItemsChange = (
		event: React.SyntheticEvent,
		itemIds: string[]
	) => {
		setExpandedItems(itemIds);
	};

	const handleExpandClick = () => {
		setExpandedItems((oldExpanded) =>
			oldExpanded.length === 0
				? [
						...godowns.map((g) => `godown-${g.id}`),
						...items.map((i) => `item-${i.item_id}`),
				  ]
				: []
		);
	};

	const handleExpandAll = () => {
		setExpandedItems([
			...godowns.map((g) => `godown-${g.id}`),
			...items.map((i) => `item-${i.item_id}`),
		]);
	};

	const handleCollapseAll = () => {
		setExpandedItems([]);
	};

	return (
		<div className="p-4 relative">
			<div className="flex justify-end gap-4 mb-4">
				<button
					onClick={handleCollapseAll}
					className="px-4 py-1 md:py-2 flex items-center bg-[#261A57] text-white rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				>
					<UnfoldLessOutlinedIcon />
					<span className="hidden md:inline">Collapse</span>
				</button>
				<button
					onClick={handleExpandAll}
					className="px-4 py-1 md:py-2 flex items-center bg-[#261A57] text-white rounded-xl shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
				>
					<UnfoldMoreOutlinedIcon />
					<span className="hidden md:inline">Expand</span>
				</button>
			</div>
			<SimpleTreeView
				expandedItems={expandedItems}
				onExpandedItemsChange={handleExpandedItemsChange}
			>
				{godowns
					.filter((g) => g.parent_godown_id === null)
					.map(renderTree)}
			</SimpleTreeView>
		</div>
	);
}
