import { useState, useEffect, useCallback, useRef } from 'react';

import { hasNewOrders, markAllAsViewed } from '../api/adminApi';

const useOrderNotifications = (interval = 5000) => {
  // The state is now a simple boolean, not an array of orders
  const [hasNewOrder, setHasNewOrder] = useState(false);
  const notificationSound = useRef(null);
  const isFetching = useRef(false); // Prevents multiple API calls from overlapping

  // Initialize the audio object once
  useEffect(() => {
    notificationSound.current = new Audio('/notification_sound.mp3');
  }, []);

  // This function contains the core polling logic
  const checkForNewOrders = useCallback(async () => {
    // If a check is already running, skip this one to prevent spamming the server
    if (isFetching.current) {
      return;
    }
    isFetching.current = true;

    try {
      // 1. Ask the backend if there are any new orders
      const response = await hasNewOrders();
      const newOrderStatus = response.data.hasNewOrders;

      // Update state to control the UI (e.g., the notification badge)
      setHasNewOrder(newOrderStatus);

      // If the backend says there are new orders...
      if (newOrderStatus) {
        // 2. Play the notification sound
        if (notificationSound.current) {
          notificationSound.current.play().catch(e => console.warn("Sound play failed:", e));
        }

        // 3. Immediately tell the backend to mark them as viewed.
        // This is the critical step that "resets" the notification.
        // The next poll will return `false` until another new order arrives.
        await markAllAsViewed();
      }
    } catch (error) {
      console.error("Failed to poll for new orders:", error);
    } finally {
      // Allow the next check to run
      isFetching.current = false;
    }
  }, []);

  // This effect sets up the timer to run the polling function
  useEffect(() => {
    // Check immediately when the component first loads
    checkForNewOrders();

    // Then, check every 5 seconds (or whatever interval is passed)
    const poller = setInterval(checkForNewOrders, interval);

    // This is a cleanup function that runs when the component is unmounted.
    // It stops the timer to prevent memory leaks.
    return () => clearInterval(poller);
  }, [checkForNewOrders, interval]);

  // The hook now returns a simple boolean value instead of an array and a function.
  return hasNewOrder;
};

export default useOrderNotifications;
