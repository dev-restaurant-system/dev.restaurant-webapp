import React, { useState } from 'react';
import {
    Box, Button, Popover, List, ListItemButton, ListItemText,
    Typography, Divider, TextField, Stack
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { getDateRangePresets } from '../../utils/chartHelpers';
import { format } from 'date-fns';

const DateRangePicker = ({ value, onChange, sx = {} }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [customMode, setCustomMode] = useState(false);
    const [tempStartDate, setTempStartDate] = useState(value.startDate);
    const [tempEndDate, setTempEndDate] = useState(value.endDate);

    const presets = getDateRangePresets();
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setCustomMode(false);
    };

    const handlePresetSelect = (preset) => {
        onChange({
            startDate: preset.startDate,
            endDate: preset.endDate,
            label: preset.label
        });
        handleClose();
    };

    const handleCustomApply = () => {
        if (tempStartDate && tempEndDate) {
            onChange({
                startDate: tempStartDate,
                endDate: tempEndDate,
                label: `${format(tempStartDate, 'MMM dd')} - ${format(tempEndDate, 'MMM dd')}`
            });
            handleClose();
        }
    };

    const displayText = value.label || 
        `${format(value.startDate, 'MMM dd')} - ${format(value.endDate, 'MMM dd')}`;

    return (
        <>
            <Button
                variant="outlined"
                onClick={handleClick}
                startIcon={<CalendarTodayIcon />}
                sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    minWidth: '200px',
                    justifyContent: 'flex-start',
                    ...sx
                }}
            >
                {displayText}
            </Button>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                    sx: { width: customMode ? 400 : 250, borderRadius: 2 }
                }}
            >
                {!customMode ? (
                    <List dense>
                        {presets.map((preset) => (
                            <ListItemButton
                                key={preset.value}
                                onClick={() => handlePresetSelect(preset)}
                                selected={value.label === preset.label}
                            >
                                <ListItemText primary={preset.label} />
                            </ListItemButton>
                        ))}
                        <Divider />
                        <ListItemButton onClick={() => setCustomMode(true)}>
                            <ListItemText primary="Custom Range" />
                        </ListItemButton>
                    </List>
                ) : (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Custom Date Range
                            </Typography>
                            <Stack spacing={2}>
                                <DatePicker
                                    label="Start Date"
                                    value={tempStartDate}
                                    onChange={setTempStartDate}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                                <DatePicker
                                    label="End Date"
                                    value={tempEndDate}
                                    onChange={setTempEndDate}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                    <Button onClick={handleClose} variant="outlined" size="small">
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleCustomApply} 
                                        variant="contained" 
                                        size="small"
                                        disabled={!tempStartDate || !tempEndDate}
                                    >
                                        Apply
                                    </Button>
                                </Box>
                            </Stack>
                        </Box>
                    </LocalizationProvider>
                )}
            </Popover>
        </>
    );
};

export default DateRangePicker;
