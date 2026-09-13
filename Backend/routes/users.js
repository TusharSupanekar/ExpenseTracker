const express = require('express');
const userCtrl = require('../controllers/user');
const GroupsCtrl = require('../middlewares/Groups');
const TransactionsCtrl = require('../middlewares/Transactions');
const CategoriesCtrl = require('../middlewares/Categories');

const router = express.Router();



router.post('/api/users/register', userCtrl.register);
router.post('/api/users/login', userCtrl.login);
router.post('/api/users/add-friend', userCtrl.addFriend);
router.post('/api/users/display-friends', userCtrl.displayFriends);
router.post('/api/users/create-group', userCtrl.createGroup);
router.post('/api/users/add-members', userCtrl.addMembersToGroup);
router.post('/api/users/display-groups', GroupsCtrl.fetchUserGroups, GroupsCtrl.fetchAmountInvestedInGroup);
router.post('/api/users/add-transaction', userCtrl.addTransactionToGroup, TransactionsCtrl.populateAllTransactionsInAGroup);
router.get('/api/users/profile', TransactionsCtrl.getMonthwiseUserExpends, TransactionsCtrl.getTopCategryExpends, userCtrl.profile);
router.get('/api/users/group', CategoriesCtrl.getCategories, userCtrl.displayGroup);

module.exports = router