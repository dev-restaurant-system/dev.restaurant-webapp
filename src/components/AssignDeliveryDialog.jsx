import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, Select, MenuItem,
    FormControl, InputLabel, DialogActions, Button, Box
} from '@mui/material';
import { getAvailableDeliveryPeople } from '../api/adminApi';

const AssignDeliveryDialog = ({ open, onClose, onAssign, orderId }) => {
    const [people, setPeople] = useState([]);
    const [selectedPersonId, setSelectedPersonId] = useState('');

    useEffect(() => {
        if (open) {
            getAvailableDeliveryPeople()
                .then(response => setPeople(response.data))
                .catch(err => console.error("Failed to fetch available staff", err));
        }
    }, [open]);

    const handleAssign = () => {
        if (selectedPersonId) {
            onAssign(orderId, selectedPersonId);
        }
    };
    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Assign Order #{orderId} to a Delivery Person</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2, minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel>Available Staff</InputLabel>
                        <Select
                            value={selectedPersonId}
                            label="Available Staff"
                            onChange={(e) => setSelectedPersonId(e.target.value)}
                        >
                            {people.map((person) => (
                                <MenuItem key={person.id} value={person.id}>
                                    {person.name} ({person.phone})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleAssign} variant="contained">Assign</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AssignDeliveryDialog;