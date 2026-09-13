const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const asynchandler = require('express-async-handler');
const User = require('../models/User');
const Friends = require('../models/Friends');
const Groups = require('../models/Groups');
const Transactions = require('../models/Transactions');
const GroupTransactions = require('../models/GroupTransactions');
const TransactionCategories = require('../models/TransactionCategories');
const CategorySpends = require('../models/CategorySpends');
const GroupLedger = require('../models/GroupLedger');

const userCtrl = {

    //Register
    register: asynchandler(async (req, res) => {
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            throw new Error("All fields are required");
        }
        const userExists = await User.findOne({email});

        if(userExists){
            throw new Error("User Already Exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userCreated = await User.create({username, password: hashedPassword, email});

        res.json({username: userCreated.username, email: userCreated.email, id: userCreated.id});
    }),
    //Login
    login: asynchandler(async (req, res) => {
        const {username, email, password} = req.body;
        const userExists = await User.findOne({email});
        if(userExists){
            const isMatch = bcrypt.compare(password, userExists.password)
            if(isMatch){
                const token = jwt.sign({id: userExists._id}, 'anykey', {expiresIn: '30d'})

                res.json({
                    message: "Logged In succesfully",
                    token, 
                    id: userExists._id, 
                    email: userExists.email, 
                    username: userExists.username
                })
            }else{
                throw new Error("Invalid Credentials");
            }
        }else{
            throw new Error("username/password is incorrect");
        }
        
    }),
    //Profile
    profile: asynchandler(async (req, res) => {
        // Convert req.user to ObjectId if it's a string (proper conversion)
        const user = req.query.user;

        console.log("user is => " + JSON.stringify(req.body));

        console.log("userId: " + user);

        // Fetch the user by ObjectId and exclude the password field
        const userFound = await User.findById(user).select("-password").populate({path: "friends", select: "friend", populate: {path: "friend", select:"username email"}});

        if (!userFound) {
            return res.status(404).json({ message: "User not found" });
        }

        let response = {}

        response["MonthwiseTransactions"] = req.body.monthwiseTransactions;
        response["TopCategories"] = req.body.TopCategories;
        response["UserData"] = userFound

        res.json({ response });
    }),
    addFriend: asynchandler(async (req, res) => {
        const {Friendemail, UserId, UserName, Email} = req.body;
        //console.log("FriendId: " + FriendId)
        console.log("Friendemail: " + Friendemail)
        console.log("UserId: " + UserId)
        const friendExists = await Friends.findOne({friendEmail: Friendemail, user: UserId});
        console.log("Friend: " + friendExists);
        if(friendExists){
            throw new Error(`You are already Friends with this person`);
        }else{
            const friendIsUser = await User.findOne({email: Friendemail})
            if(!friendIsUser){
                res.json({message: "This person does not exist. Please check the email id."})
            }
            const newFriendship = await Friends.create({
                user: UserId,
                friend: friendIsUser.username,
                friendEmail: Friendemail,
                friendId: friendIsUser._id
            })
            const newFriendship_2 = await Friends.create({
                user: friendIsUser._id,
                friendId: UserId,
                friend: UserName,
                friendEmail: Email
            })
            await User.findByIdAndUpdate(UserId, { $push: { friends: newFriendship._id } }).populate("friends");
            await User.findByIdAndUpdate(friendIsUser._id, { $push: { friends: newFriendship_2._id } });
            const updatedUser = await User.findById(UserId).populate("friends");
            res.json({
                success: true,
                user: updatedUser,
                message: "Friend added successfully"
            })
        }
    }),
    displayFriends: asynchandler(async (req, res) => {
        const {friends} = req.body;

        const friendsArray = await Friends.find({
            _id: {$in: friends}
        })

        console.log("These are the friends: " + friendsArray);
        res.json({friendsArray});
    }),
    createGroup: asynchandler(async (req, res) => {
        const {userId, groupName} = req.body;

        const group = await Groups.create({
            groupName: groupName,
            members: [],
            admin: userId
        });

        const populatedGroup = await Groups.findById(group._id).populate('admin', 'username email');

        res.json(populatedGroup)
    }),
    displayGroup: asynchandler(async (req, res) => {
        const {groupId} = req.query;
        const groupTransactions = await GroupTransactions.find({group: groupId})
        .populate({ path: 'user', select: 'username email' }) // Populate 'user' field from User model
        .populate({
          path: 'includedMembers', // Populate 'includedMembers' from IndividualTransactions
          populate: {
            path: 'includedMember', // Nested populate: Populate 'includedMember' from User model
            select: 'username email' // Select fields you need from the User model
          }
        });
        response = {groupTransactions, categories: req.body.categories}
        res.json({response});
    }),
    addMembersToGroup: asynchandler(async (req, res) => {
        const {groupId, newMembers} = req.body;
        //const group = await Groups.findById(groupId).populate('admin members', 'username email');

        const group = newMembers.length == 0 ? await Groups.findByIdAndUpdate(groupId, { $push: { members: {$each: newMembers} } }).populate('admin members', 'username email') :
            await Groups.findByIdAndUpdate(groupId, { $addToSet: { members: {$each: newMembers} } }).populate('admin members', 'username email');
        if(!group){
            throw new Error("Some Error Occurred");
        }
        res.json({group});
    }),
    addTransactionToGroup: asynchandler(async (req, res, next) => {
        const {description, category, groupId, userId, members, amount} = req.body;
        const transactionData = [];
        var LedgerData = [];
        for(let key in members){
            let currTransaction = {};
            currLedger = {}
            currTransaction['includedMember'] = key;
            currTransaction['amount'] = members[key];
            currTransaction['user'] = userId;
            currTransaction['description'] = description
            currTransaction['category'] = category
            if(key != userId){
                currLedger['owedby'] = key;
                currLedger['amount'] = members[key];
                currLedger['paidby'] = userId;
                currLedger['group'] = groupId;
                LedgerData.push(currLedger);
            }
            transactionData.push(currTransaction);
        }
        //const session = await mongoose.startSession();
        try{
            const Ledger = await GroupLedger.insertMany(LedgerData);
            const transactions = await Transactions.insertMany(transactionData);
            if(transactions){
                const transactionIds = transactions.map(transaction => transaction._id)
                let groupTransaction = await GroupTransactions.create({
                   user: userId,
                   group: groupId,
                   includedMembers: transactionIds,
                   amount: amount,
                   description: description,
                   category: category
                })
                //await session.commitTransaction();
                await CategorySpends.findOneAndUpdate(
                    {user: userId, category: category},
                    {$inc: {totalAmountSpent: members[userId]}},
                    {upsert: true}
                );
                populatedTransaction = await groupTransaction.populate([{path: 'includedMembers', populate: {path: 'user includedMember', select:'username email'}}, 'group']);
                req.body.group = populatedTransaction.group;
                next();
            }else{
                //await session.abortTransaction();
                res.json({
                    message: "Some Unknown Error Occurred"
                })
            }
        }catch(error){
            console.error("Transaction aborted due to error:", error);
            //await session.abortTransaction();
        }//finally {
           // session.endSession();
        //}        
    })
};

module.exports = userCtrl;