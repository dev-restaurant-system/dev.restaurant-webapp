import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

const PrintableOrderToken = ({ order }) => {
  if (!order) return null;

  // Safe helper to format currency values or fallback
  const formatCurrency = (value) => {
    return (typeof value === 'number' && !isNaN(value)) ? value.toFixed(2) : '0.00';
  };

  return (
    <Box className="thermal-receipt-content" sx={{ fontFamily: "'Courier New', monospace" }}>
      <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', mb: 1 }}>
        Dev.Restaurant
      </Typography>

      {order.id && (
        <Typography variant="body2" sx={{ textAlign: 'center', mb: 1, fontWeight: 'bold' }}>
          Order ID: {order.id}
        </Typography>
      )}
      
      <Divider sx={{ my: 1 }} />

      
      
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        {order.orderDate ? `${new Date(order.orderDate).toLocaleDateString()} ${new Date(order.orderDate).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}` : ''}
      </Typography>
      
      <Typography variant="body2" sx={{ mb: 1 }}>
        Customer: {order.customerName || 'N/A'}
      </Typography>
      
      {order.customerPhone && order.customerPhone !== 'N/A' && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          Phone: {order.customerPhone}
        </Typography>
      )}

      {/* Added Customer Address printing */}
      {order.customerAddress && order.customerAddress !== 'N/A' && (
        <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-line' }}>
          Address: {order.customerAddress}
        </Typography>
      )}
      
      <Divider sx={{ my: 1 }} />
      
      {order.items?.map((item, index) => (
        <Box key={index} sx={{ mb: 0.5 }}>
          <Typography sx={{ fontSize: 12 }}>
            {item.menuItemName || 'Unknown Item'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
            <Typography>
              ₹{formatCurrency(item.priceAtOrder)} x {item.quantity || 0}
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              ₹{formatCurrency((item.priceAtOrder || 0) * (item.quantity || 0))}
            </Typography>
          </Box>
        </Box>
      ))}
      
      <Divider sx={{ my: 1 }} />
      
      {order.subtotal != null && (
        <Box sx={{ fontSize: 12, mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Subtotal:</Typography>
            <Typography>₹{formatCurrency(order.subtotal)}</Typography>
          </Box>

          {order.gstAmount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>GST ({order.gstRate || 0}%):</Typography>
              <Typography>₹{formatCurrency(order.gstAmount)}</Typography>
            </Box>
          )}

          {order.specialChargeAmount !== 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>{order.specialChargeName || 'Adj.'}:</Typography>
              <Typography>₹{formatCurrency(order.specialChargeAmount)}</Typography>
            </Box>
          )}

          <Divider sx={{ my: 0.5, borderStyle: 'dashed' }} />
        </Box>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: 14, mb: 1 }}>
        <Typography>Total:</Typography>
        <Typography>₹{formatCurrency(order.totalAmount)}</Typography>
      </Box>
    </Box>
  );
};

export default PrintableOrderToken;
