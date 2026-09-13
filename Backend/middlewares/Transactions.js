const mongoose = require('mongoose');
const GroupTransactions = require('../models/GroupTransactions');
const IndividualTransactions = require('../models/Transactions');

const TransactionsCtrl = {
    populateAllTransactionsInAGroup : async(req, res) => {
        const groupId = req.body.group._id
        //console.log(groupName);
        const transactions = await GroupTransactions.find({group: groupId}).populate([{path: 'user', select: 'username email'}, 'group', {path: "includedMembers", populate: {path: 'user includedMember', select:'username email'}}]);
    
        res.json({transactions});
    },
    getMonthwiseUserExpends: async(req, res, next) => {
        //var transactionsQuery = [];
        console.log("user is => " + JSON.stringify(req.body));
        const user = req.query.user;
        const currYear = new Date().getFullYear()
        const startDate = new Date(currYear, -1, 1);
        const endDate = new Date(currYear, 11, 1);
        const query = {
            date:{
                $gte: startDate,
                $lte: endDate
            },
            user,
            includedMember: user
        }

        console.log("USER IS: " + new mongoose.Types.ObjectId(user));
        req.body.user = user;
        //const testQuery = await IndividualTransactions.find({
        //    user: user,
        //    includedMember: user
        //});
          
       // console.log("Matching documents:", testQuery);

        const transactions = await IndividualTransactions.aggregate([
            {
              $match: {includedMember: new mongoose.Types.ObjectId(user)} // Filter transactions by user ID
            },
            {
              $group: {
                _id: { month: { $month: "$user" }}, // Group by month and year
                totalAmount: { $sum: "$amount" } // Sum the amount for each group
              }
            },
            {
              $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
            }
          ]);
          
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          let transformedData = {}

          months.forEach(month => transformedData[month] = 0);

          transactions.forEach(item => {
            const month = months[item._id.month-1]
            transformedData[month] = item.totalAmount
          })

          req.body.monthwiseTransactions = transformedData;
          next();
    },
    getTopCategryExpends: async(req, res, next) => {
        console.log("user is => " + JSON.stringify(req.body));
        const user = req.query.user;
        req.body.userId = user;
        const transactions = await IndividualTransactions.aggregate([
            {
              $match: {includedMember: new mongoose.Types.ObjectId(user)} // Filter transactions by user ID
            },
            {
              $group: {
                _id: "$category", // Group by month and year
                totalAmount: { $sum: "$amount" } // Sum the amount for each group
              }
            },
            {
              $sort: { "totalAmount": -1 } // Sort by year and month
            },
            {
                $limit: 5 //Limiting the result to top 5 categories
            },
            {
                $lookup: {
                  from: "transactioncategories", // Name of the category collection
                  localField: "_id", // The field from the aggregation result (_id is the category ID)
                  foreignField: "_id", // The field in the category collection to match
                  as: "categoryDetails" // Alias for the joined data
                }
              },
              {
                $unwind: "$categoryDetails" // Unwind to convert the categoryDetails array into an object
              },
              {
                $project: {
                  _id: 0, // Exclude the _id field from the final result
                  categoryName: "$categoryDetails.name", // Include the category name
                  totalAmount: 1 // Include the totalAmount field
                }
              }
        ]);
        console.log("Top Categories: " + JSON.stringify(transactions));
        req.body.TopCategories = transactions;
        next();
    }
}

module.exports = TransactionsCtrl;