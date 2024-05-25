// src/store/notificationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    markAsRead: (state, action) => {
      const { notifId } = action.payload;
      const notification = state.notifications.find(notif => notif.notif_id === notifId);
      if (notification) {
        notification.is_read = true;
      }
    },
  },
});

export const { addNotification, markAsRead } = notificationSlice.actions;

export default notificationSlice.reducer;
