import { create } from "zustand";
import api from "../src/services/api.js";
import { useAuthStore } from "./useAuthStore.js";
import toast from "react-hot-toast";
import { addFriend } from "../../backend/src/controllers/friend.controller.js";

export const useChatStore = create((set, get) => ({
  users: [],
  useStore: [],
  messages: [],
  selectedUser: null,
  isUserLoading: false,
  isMessageLoading: false,
  isFriend: true,

  friendRequestSent: false,

  friendRequestReceived: false,

  getUsers: async () => {
    set({ isUserLoading: true });
    try {
      const res = await api.get("/message/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while fetching users"
      );
    } finally {
      set({ isUserLoading: false });
    }
  },
  getMessage: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await api.get("/message/" + userId);
      set({ messages: res.data });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while getting messages users"
      );
    } finally {
      set({ isMessageLoading: false });
    }
  },
  //send messages
  setMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await api.post(
        `/message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while sending messages users"
      );
    }
  },
  subscribeToMessage: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;
    socket.on("newMessage", (newMessage) => {
      const isMessageSendFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSendFromSelectedUser) return;
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },
  unsubscribeToMessage: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  addFriend: async (friendId) => {
    try {
      const res = await api.post("/friend/add", { friendId });
      toast.success(res.data.message);

      const socket = useAuthStore.getState().socket;
      if (socket) {
        socket.emit("friendRequestSent", friendId);
      }
      set({ friendRequestSent: true });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while Adding friends"
      );
    }
  },
  acceptFriendRequest: async (friendId) => {
    try {
      const res = await api.post("/friend/accept", { friendId });
      toast.success(res.data.message);

      set({ isFriend: true, friendReqReceived: false });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Something went wrong while accepting request"
      );
    }
  },
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
  setIsFriend: (isFriend) => {
    set({ isFriend });
  },
  setFriendRequestSent: (friendRequestSent) => {
    set({ friendRequestSent });
  },
  setFriendRequestReceived: (friendRequestReceived) => {
    set({ friendRequestReceived });
  },
}));
