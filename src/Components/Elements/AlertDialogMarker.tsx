import { IconButton } from "@radix-ui/themes";
import { TrashIcon } from "@radix-ui/react-icons";
import { AlertDialog } from "radix-ui";
import "@radix-ui/themes/styles.css";

interface AlertProps {
	name: string;
	onDelete: () => void;
}

const AlertDialogMarker: React.FC<AlertProps> = ({ name, onDelete }) => (
	<AlertDialog.Root>
		<AlertDialog.Trigger asChild>
			<IconButton radius="full" aria-label={`Delete restaurant ${name}`}color="crimson" variant="ghost">
				<TrashIcon width="35" height="35" />
			</IconButton>
		</AlertDialog.Trigger>
		<AlertDialog.Portal>
			<AlertDialog.Overlay className="AlertDialogOverlay" />
			<AlertDialog.Content className="AlertDialogContent">
				<AlertDialog.Title className="AlertDialogTitle">
					Are you absolutely sure?
				</AlertDialog.Title>
				<AlertDialog.Description className="AlertDialogDescription">
					This action will delete marker: {name}. This will permanently delete
					your marker and remove your data from our servers.
				</AlertDialog.Description>
				<div style={{ display: "flex", gap: 25, justifyContent: "flex-end" }}>
					<AlertDialog.Cancel asChild>
						<button type="button" aria-label="Cancel delete"  className="Button mauve">
							Cancel
						</button>
					</AlertDialog.Cancel>
					<AlertDialog.Action asChild>
						<button type="button" aria-label={`Delete restaurant ${name}`} className="Button red" onClick={onDelete}>
							Yes, delete marker
						</button>
					</AlertDialog.Action>
				</div>
			</AlertDialog.Content>
		</AlertDialog.Portal>
	</AlertDialog.Root>
);

export default AlertDialogMarker;
