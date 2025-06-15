import mongoose from "mongoose";
import User from "../models/auth.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const allUsers = [];
    users.forEach((user) => {
      allUsers.push({
        _id: user._id,
        name: user.name,
        email: user.email,
        about: user.about,
        tags: user.tags,
        joinedOn: user.joinedOn,
        points: user.points,
        friends: user.friends,
        sentRequests: user.sentRequests,
        friendRequests: user.friendRequests,
        currentPlan: user.currentPlan
      })
    })
    return res.status(200).json(allUsers);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}

export const updateUser = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No user with that id");
  }
  try{
    const updatedUser = await User.findByIdAndUpdate(_id, { name, about, tags }, { new: true });
    return res.status(200).json(updatedUser);
  }
  catch(error){
    return res.status(404).json({ message: error.message });
  }
}

export const sendFriendRequest = async (req, res) => {
  const { fromId, toId } = req.body;

  try{
    if(fromId === toId){
      return res.status(400).json({ message: "You can't send a friend request to yourself" });
    }

    const fromUser = await User.findById(fromId);
    const toUser = await User.findById(toId);

    if (!fromUser || !toUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if already friends
    const alreadyFriends = fromUser.friends.some(friend => friend.userId === toId);
    if (alreadyFriends) {
      return res.status(400).json({ message: "You are already friends." });
    }

    // Check if already sent
    const alreadySent = fromUser.sentRequests.some(req => req.userId === toId);
    if (alreadySent) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    // Check if already received from that user
    const alreadyReceived = fromUser.friendRequests.some(req => req.userId === toId);
    if (alreadyReceived) {
      return res.status(400).json({ message: "That user has already sent you a friend request." });
    }

    // Add to both users' requests
    fromUser.sentRequests.push({ userId: toUser._id, name: toUser.name });
    toUser.friendRequests.push({ userId: fromUser._id, name: fromUser.name });

    await fromUser.save();
    await toUser.save();

    return res.status(200).json({ message: "Friend request sent successfully." });
  }
  catch(error){
    return res.status(404).json({ message: error.message });
  }
}

export const rejectFriendRequest = async (req, res) => {
  const { myId, friendId } = req.body;

  try{
    const me = await User.findById(myId);
    const sender = await User.findById(friendId);

    if (!me || !sender) {
      return res.status(404).json({ message: "User not found." });
    }

    me.friendRequests = me.friendRequests.filter(
      (req) => req.userId !== friendId
    );
    sender.sentRequests = sender.sentRequests.filter(
      (req) => req.userId !== myId
    );

    await me.save();
    await sender.save();
    return res.status(200).json({ message: "Friend request rejected." });
  }
  catch (error) {
    return res.status(500).json({ message: "Error: " + error.message });
  }
}

export const acceptFriendRequest = async (req, res) => {
  const { myId, friendId } = req.body;

  try{
    const me = await User.findById(myId);
    const sender = await User.findById(friendId);

    if (!me || !sender) {
      return res.status(404).json({ message: "User not found." });
    }

    me.friends.push({ userId: sender._id, name: sender.name });
    sender.friends.push({ userId: me._id, name: me.name });

    me.friendRequests = me.friendRequests.filter(
      (req) => req.userId !== friendId
    );
    sender.sentRequests = sender.sentRequests.filter(
      (req) => req.userId !== myId
    );

    await me.save();
    await sender.save();

    return res.status(200).json({ message: "Friend request accepted." });
  }
  catch (error) {
    return res.status(500).json({ message: "Error: " + error.message });
  }
}

export const removeFriend = async (req, res) => {
  const { myId, friendId } = req.body;

  try{
    const me = await User.findById(myId);
    const sender = await User.findById(friendId);

    if (!me || !sender) {
      return res.status(404).json({ message: "User not found." });
    }

    me.friends = me.friends.filter((friend) => friend.userId !== friendId);
    sender.friends = sender.friends.filter((friend) => friend.userId !== myId);

    await me.save();
    await sender.save();
    return res.status(200).json({ message: "Friend removed." });
  }
  catch (error) {
    return res.status(500).json({ message: "Error: " + error.message });
  }
}

export const sharePoints = async (req, res) => {
  const { recipientId, amount } = req.body;
  const senderId = req.userId;

  if (!senderId || !recipientId || !amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);
    if (!sender || !recipient) {
      return res.status(404).json({ message: "User not found" });
    }
    if (sender.points <= 10 || sender.points < amount) {
      return res.status(400).json({ message: "Insufficient points to transfer" });
    }
    sender.points -= amount;
    recipient.points += amount;
    await sender.save();
    await recipient.save();
    return res.status(200).json({ message: "Points transferred successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}