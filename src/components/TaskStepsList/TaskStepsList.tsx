import { Draggable } from 'react-beautiful-dnd'
import { useOutletContext } from 'react-router-dom'
import { TBoard, TOutletContext, TTask } from '../../type'
import { StrictModeDroppable } from '../../utils/StrictModeDroppable'
import { NewStep } from '../NewStep'
import { ItemActions } from '../ItemActions'
import { TaskStep } from '../TaskStep'
import styled from 'styled-components'
import { SortButton } from '../SortButton'
import { Tooltip } from '@mui/material'

interface ITasksListProps {
	task: TTask
	index: number
	currParent: TBoard
}

interface IHeaderList {
	isdragging?: string
}

interface ITaskStepsListWrapper {
	isdraggingover?: string
	items: string[]
}

const Container = styled.li<IHeaderList>`
	display: inline-block;
	vertical-align: top;
	font-size: 1.2rem;
	border: 1px solid lightgray;
	border-radius: 8px;
	overflow: hidden;
	background-color: white;
	width: 200px;
	margin: 4px;
	border-color: ${({ isdragging }) =>
		isdragging === 'true' ? 'green' : 'lightgray'};

	@media (min-width: 768px) {
		width: 350px;
		margin: 8px;
	}
`
const HeaderList = styled.div<IHeaderList>`
	display: flex;
	width: 100%;
	padding: 8px;
	color: #333;
	justify-content: space-between;
	align-items: center;
	cursor: grab;
	border-bottom: 1px solid;
	transition: background-color 0.2s ease-in-out;
	border-color: ${({ isdragging }) =>
		isdragging === 'true' ? 'green' : 'lightgray'};
	background-color: ${({ isdragging }) =>
		isdragging === 'true' ? 'lightgreen' : 'white'};

	&:focus {
		outline: none;
	}

	&:hover {
		outline: none;
		-webkit-text-decoration: none;
		text-decoration: none;
		box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
			0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
	}

	&:focus-visible {
		outline: none;
		-webkit-text-decoration: none;
		text-decoration: none;
		box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
			0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
	}
`

const Title = styled.h3`
	margin: 0;
	font-size: 1em;
	overflow: hidden;
	text-overflow: ellipsis;
`

const ActionsStepListWrapper = styled.div`
	width: 100%;
	display: flex;
	padding: 0 8px;
`

const TaskStepsListWrapper = styled.ul<ITaskStepsListWrapper>`
	min-height: 0.1px;
	display: flex;
	width: 100%;
	flex-direction: column;
	align-items: center;
	padding: ${({ items }) => (items.length === 0 ? '0px' : '8px')};
	flex-grow: 1;
	height: 100%;
	transition: background-color 0.2s ease-in-out;
	background-color: ${({ isdraggingover }) =>
		isdraggingover === 'true' ? 'lightblue' : 'white'};
`

export const TaskStepsList = ({ task, index, currParent }: ITasksListProps) => {
	const {
		data,
		handlers: { itemSort },
	} = useOutletContext<TOutletContext>()

	return (
		<Draggable draggableId={task.id} index={index}>
			{(provided, snapshot) => (
				<Container
					{...provided.draggableProps}
					ref={provided.innerRef}
					isdragging={`${snapshot.isDragging}`}
				>
					<Tooltip title={task.title} placement='top'>
						<HeaderList
							{...provided.dragHandleProps}
							isdragging={`${snapshot.isDragging}`}
						>
							<Title>{task.title}</Title>
							<ItemActions type='список' item={task} currParent={currParent} />
						</HeaderList>
					</Tooltip>
					<NewStep currTask={task} />
					{task.stepIds.length !== 0 ? (
						<ActionsStepListWrapper>
							<SortButton
								stepIds={task.stepIds}
								currTask={task}
								handleClick={itemSort}
							/>
						</ActionsStepListWrapper>
					) : null}
					<StrictModeDroppable
						droppableId={task.id}
						type='step'
						direction='vertical'
					>
						{(provided, snapshot) => (
							<TaskStepsListWrapper
								items={task.stepIds}
								ref={provided.innerRef}
								{...provided.droppableProps}
								isdraggingover={`${snapshot.isDraggingOver}`}
							>
								{task.stepIds.map((stepId: string, index) => {
									const step = data.steps[stepId]

									return (
										<TaskStep
											key={step.id}
											step={step}
											index={index}
											currParent={task}
										/>
									)
								})}
								{provided.placeholder}
							</TaskStepsListWrapper>
						)}
					</StrictModeDroppable>
				</Container>
			)}
		</Draggable>
	)
}
