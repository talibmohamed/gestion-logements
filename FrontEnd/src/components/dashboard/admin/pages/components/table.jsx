import React from "react";
import { 
    Table, 
    TableHeader, 
    TableColumn, 
    TableBody, 
    TableRow, 
    TableCell, 
    Chip,
    Card,
    CardBody,
    Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem
} from "@nextui-org/react";
import PropTypes from "prop-types";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const statusColorMap = {
    overdue: "primary",
    pending: "warning",
    paid: "secondary",
};

const DataTable = ({ columns, rows, title }) => {

    const renderCell = React.useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case "No":
                return (
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                );
            case "id_res":
                return (
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                );
            case "name":
                return (
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                );
            case "type":
                return (
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                );
            case "mois":
                return (
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                );
            case "echeance":
                return (
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                );
            case "ttc":
                return (
                    <p className="text-bold text-sm capitalize">{cellValue}</p>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <div className="table">
            <div className="card-wrapper">
                <Card
                    isBlurred
                    className="border-none bg-background/15 white:bg-default-100/50 card-wrapper custom-card-wrapper"
                    shadow="sm"
                >
                    <CardBody>
                        <div className="card-header">
                            {title && <h2 className="table-title">{title}</h2>}
                            <div className="card-actions">
                                <Dropdown backdrop="opaque">
                                    <DropdownTrigger>
                                        <Button isIconOnly radius="full" size="sm" variant="light">
                                            <MoreHorizIcon className="text-default-600 border-none" />
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu className="dropdown-menu-custom" variant="faded" aria-label="Static Actions">
                                        <DropdownItem key="Edit" href="/dashboard/facture" classname="text-edit" color="default">Modifier</DropdownItem>
                                        <DropdownItem key="fermer" href="#" className="text-danger" color="danger">Fermer</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>
                        <Table aria-label="Example table with custom cells">
                            <TableHeader columns={columns}>
                                {(column) => (
                                    <TableColumn key={column.uid} align={"center"}>
                                        {column.name}
                                    </TableColumn>
                                )}
                            </TableHeader>
                            <TableBody items={rows}>
                                {(item) => (
                                    <TableRow key={item.id}>
                                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

DataTable.propTypes = {

    columns: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            uid: PropTypes.string.isRequired,
        })
    ).isRequired,
    rows: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            id_res: PropTypes.string.isRequired,
            nom: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            mois: PropTypes.string.isRequired,
            echeance: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            ttc: PropTypes.string.isRequired,
        })
    ).isRequired,
    title: PropTypes.string,
};

export default DataTable;
