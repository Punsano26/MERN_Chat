import UserModel from "../models/user.model.js";
export const addFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;
    console.log("friend:", friendId, "user:", userId);

    if (userId === friendId)
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a friend" });

    const user = await UserModel.findById(userId);
    const friend = await UserModel.findById(friendId);
    if (!user || !friend)
      return res.status(404).json({ message: "Friend not found" });

    //check if already friend
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: "User is already a friend" });
    }
    if (user.friendRequests.includes(friendId)) {
      user.friends.push(friendId);
      friend.friends.push(userId);
      user.friendRequests = user.friendRequests.filter(
        (id) => friendId !== id.toString()
      );
      friend.friendRequests = friend.friendRequests.filter(
        (id) => userId !== id.toString()
      );
      await user.save();
      await friend.save();
      return res.status(200).json({ message: "Friend request accepted" });
    }
    if (!friend.friendRequests.includes(userId)) {
      friend.friendRequests.push(userId);
      await friend.save();
    }
    return res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({
      message:
        error.message || "Internal Server Error While adding a new friend",
    });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { friendId } = req.body;
    const userId = req.user._id;
    console.log("friend:", friendId, "user:", userId);
    const user = await UserModel.findById(userId);
    const friend = await UserModel.findById(friendId);
    if (!user || !friend)
      return res.status(404).json({ message: "Friend not found" });
    if (!user.friendRequests.includes(friendId))
      return res.status(400).json({ message: "Friend request not found user" });
    user.friends.push(friendId);
    friend.friends.push(userId);
    user.friendRequests = user.friendRequests.filter(
      (id) => friendId !== id.toString()
    );
    friend.friendRequests = friend.friendRequests.filter(
      (id) => userId !== id.toString()
    );
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error While accepting a friend request",
    });
  }
};
