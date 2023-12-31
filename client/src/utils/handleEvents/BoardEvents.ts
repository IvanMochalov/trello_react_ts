import { TBoard, TInitialData } from '../../type';

export const BoardEvents = {
	save(data: { newId: string; itemName: string; initialValue: TInitialData }) {
		const { newId, itemName, initialValue } = data;
		const newBoard = {
			id: newId,
			title: itemName,
			taskIds: [],
		};
		return {
			...initialValue,
			boards: {
				...initialValue.boards,
				[newBoard.id]: newBoard,
			},
			boardOrder: [newId, ...initialValue.boardOrder],
		};
	},
	delete(data: { initialValue: TInitialData; currentItem: TBoard }) {
		const { initialValue, currentItem } = data;
		const currentBoard = initialValue.boards[currentItem.id];

		currentBoard.taskIds.forEach((taskId: string) => {
			const currentTask = initialValue.tasks[taskId];

			currentTask.stepIds.forEach((stepId: string) => {
				delete initialValue.steps[stepId];
			});

			delete initialValue.tasks[taskId];
		});

		delete initialValue.boards[currentItem.id];

		const newBoardOrder = initialValue.boardOrder.filter(function (id: string) {
			return id !== currentItem.id;
		});

		return {
			...initialValue,

			boardOrder: newBoardOrder,
		};
	},
	edit(data: {
		newItemName: string;
		initialValue: TInitialData;
		currentItem: TBoard;
	}) {
		const { newItemName, initialValue, currentItem } = data;
		const currentBoard = initialValue.boards[currentItem.id];

		const newBoard = {
			...currentBoard,
			title: newItemName,
		};

		return {
			...initialValue,
			boards: {
				...initialValue.boards,
				[newBoard.id]: newBoard,
			},
		};
	},
};
