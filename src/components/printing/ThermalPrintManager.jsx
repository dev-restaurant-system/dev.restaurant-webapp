import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, ButtonGroup, Typography } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import PrintableOrderToken from './PrintableOrderToken';

const ThermalPrintManager = ({ open, onClose, order }) => {
    const [selectedSize, setSelectedSize] = useState("3inch");

    const paperSizes = [
        { id: "2inch", label: "2\" Kitchen", width: "57mm", use: "Kitchen Orders" },
        { id: "3inch", label: "3\" Receipt", width: "80mm", use: "Kitchen Orders" },
        { id: "4inch", label: "4\" Detailed", width: "102mm", use: "Kitchen Orders" }
    ];

    const handlePrint = () => {
        const style = document.createElement('style');
        style.id = 'thermal-print-style';

        let pageSize = '';
        let margin = '0.05in';
        switch (selectedSize) {
            case '2inch':
                pageSize = '2.25in';
                margin = '0.005in';
                break;
            case '3inch':
                pageSize = '3.15in';
                margin = '0.075in';
                break;
            case '4inch':
                pageSize = '4in';
                margin = '0.1in';
                break;
            default:
                break;
        }

        if (pageSize) {
            style.innerHTML = `@page { size: ${pageSize} auto; margin: ${margin}; }`;
            document.head.appendChild(style);
        }

        document.body.className = `thermal-receipt-${selectedSize}`;

        setTimeout(() => {
            window.print();
            document.body.className = '';
            document.getElementById('thermal-print-style')?.remove();
            onClose();
        }, 100);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Select Thermal Paper Size</DialogTitle>

            <DialogContent>
                <Box sx={{ mb: 3 }}>
                    <ButtonGroup variant="outlined" fullWidth>
                        {paperSizes.map((size) => (
                            <Button
                                key={size.id}
                                variant={selectedSize === size.id ? "contained" : "outlined"}
                                onClick={() => setSelectedSize(size.id)}
                                sx={{ flexDirection: 'column', py: 1 }}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                    {size.label}
                                </Typography>
                                <Typography variant="caption" sx={{ fontSize: '10px' }}>
                                    {size.width}
                                </Typography>
                                <Typography variant="caption" sx={{ fontSize: '9px', color: 'text.secondary' }}>
                                    {size.use}
                                </Typography>
                            </Button>
                        ))}
                    </ButtonGroup>
                </Box>

                {/* Styled Preview Area */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    py: 2,
                    backgroundColor: '#e0e0e0', 
                    borderRadius: 1,
                }}>
                    <Box sx={{
                        width: {
                            '2inch': '2.25in',
                            '3inch': '3.15in',
                            '4inch': '4in'
                        }[selectedSize],
                        maxHeight: '400px', 
                        overflowY: 'auto',   
                        backgroundColor: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: '1px solid #ccc',
                        transition: 'width 0.3s ease-in-out', // Animate width changes
                        p: 1,
                        fontFamily: "'Courier New', Courier, monospace",
                        color: 'black',
                        '& *': { 
                            fontFamily: "'Courier New', Courier, monospace !important",
                        }
                    }}>
                        <div className={`printable-area print-${selectedSize}`}>
                            <PrintableOrderToken order={order} paperSize={selectedSize} />
                        </div>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handlePrint} variant="contained" startIcon={<PrintIcon />}>
                    Print {paperSizes.find(s => s.id === selectedSize)?.label}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ThermalPrintManager;
