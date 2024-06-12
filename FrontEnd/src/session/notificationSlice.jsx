// src/store/notificationSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload;
    },
    addNotification(state, action) {
      state.notifications.push(action.payload);
    },
    markAsRead(state, action) {
      const { notificationId } = action.payload;
      const notification = state.notifications.find(
        (notif) => notif.notif_id === notificationId
      );
      if (notification) {
        notification.is_read = 1;
      }
    },
  },
});

export const { setNotifications, addNotification, markAsRead } =
  notificationSlice.actions;

export const selectNotifications = (state) => state.notifications.notifications;

export default notificationSlice.reducer;
