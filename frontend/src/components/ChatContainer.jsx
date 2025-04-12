import React, { useState, useEffect, useRef } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MeassageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";


const Chatcontainer = () => {
  const {
    messages,
    getMessage,
    selectedUser,
    subscribeToMessage,
    unsubscribeToMessage,
    isMessageLoading,
    isFriend,
    friendRequestSent,
    addFriend,
    friendRequestReceived,
    setIsFriend,
    setFriendRequestSent,
    setFriendRequestReceived,
    acceptFriendRequest,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  const handleAddfriend = () => {
    addFriend(selectedUser._id);
    setIsFriend(false);
    setFriendRequestSent(true);
    setFriendRequestReceived(false);
  };

  useEffect(() => {
    if (authUser && selectedUser) {
      setIsFriend(authUser?.friends.includes(selectedUser._id));
      setFriendRequestReceived(
        authUser?.friendRequests.includes(selectedUser._id)
      );
      setFriendRequestSent(selectedUser.friendRequests.includes(authUser._id));
    }
  }, [authUser, selectedUser]);
  

  useEffect(() => {
    //get history messages
    getMessage(selectedUser._id);
    //listen
    subscribeToMessage();
    return () => unsubscribeToMessage();
  }, [selectedUser._id, subscribeToMessage, unsubscribeToMessage, getMessage]);
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (authUser && selectedUser) {
      setIsFriend(authUser.friends.includes(selectedUser._id));
      setFriendRequestReceived(authUser.friendRequests.includes(selectedUser._id));
      setFriendRequestSent(selectedUser.friendRequests.includes(authUser._id));
    }
  }, [
    setIsFriend,
    setFriendRequestSent,
    setFriendRequestReceived,
    authUser,
    selectedUser,
  ]);

  if (isMessageLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageInput />
        <MessageSkeleton />
      </div>
    );
  }
  const handleAcceptRequest = async () => {
    try {
      await acceptFriendRequest(selectedUser._id); // เรียก API จริง
      setIsFriend(true);
      setFriendRequestReceived(false); // เพราะยอมรับแล้ว
      setFriendRequestSent(false);     // ไม่ต้องรอแล้ว
      getMessage(selectedUser._id);    // โหลดข้อความใหม่หลังเป็นเพื่อน
    } catch (err) {
      console.error("Accept friend request failed:", err);
    }
  };
  
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      {!isFriend && !friendRequestSent && !friendRequestReceived && (
        <div className="p-4 text-center text-rose-500">
          You must be friend with this user to send messages!
          <button onClick={handleAddfriend} className="btn btn-sm ml-2">
            Add friend
          </button>
        </div>
      )}
      {!isFriend && friendRequestSent && !friendRequestReceived && (
        <div className="p-4 text-center text-amber-500">
          You have sent a friend request. Waiting for acceptance!
        </div>
      )}
      {!isFriend && !friendRequestSent && friendRequestReceived && (
        <div className="p-4 text-center text-emerald-500">
          {selectedUser.name} have sent you a friend request. Waiting for your
          response!
          <button onClick={handleAcceptRequest} className="btn btn-sm ml-2">
            Accept friend
          </button>
        </div>
      )}

      <MessageInput />
    </div>
  );
};

export default Chatcontainer;
