import React from "react";
import Header from '../Components/Header'
import Sidebar from '../Components/Siderbar'
import GroupCard from "../Components/GroupCards";
import { useState,useEffect } from 'react'
import '../Styles/Group.css'
import Cookies from 'js-cookie';
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import GroupTransactions from "../Components/GroupTransactions";
import TransactionPopup from "../Components/TransactionPopup";
import Select from 'react-select';

const Group = () => {

    const location = useLocation();
    const { groupId, groupName, members, message } = location.state || {};
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false)
    const [groupTransactions, setGroupTransactions] = useState([]);
    const [transactionPopup, setTransactionPopup] = useState(false);
    const [refreshData, setRefreshData] = useState(false);  
    const [categories, setCategories] = useState([]);
    const [selectedMembers, setSelecteMembers] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    var mems = [];
    var categry = "";
    const OpenSidebar = () => {
        setOpenSidebarToggle(!openSidebarToggle)
    }
    console.log("members: " + JSON.stringify(members));
    useEffect(() => {
        const fetchGroupTransactions = async() => {
            const response = await axios.get("http://localhost:3000/api/users/group", {
                params: { 
                            groupId
                        }
            })
            setGroupTransactions(response.data.response.groupTransactions);
            setCategories(response.data.response.categories);
            console.log("response: " + JSON.stringify(response.data.response));
        }
        fetchGroupTransactions();
    }, [groupId, refreshData])

    const openTransactionPopup = () => {
        console.log(transactionPopup)
        setTransactionPopup(!transactionPopup);
        //setRefreshData(!refreshData);
        console.log(transactionPopup)
    }

    const handleSelectChange = (selectedOptions) => {
        console.log(selectedOptions);
        const selectedValues = selectedOptions ? selectedOptions.map(option=> option.value) : [];
        console.log("selectedValues: " + selectedValues);
        mems = selectedValues;
        console.log(mems);
        setSelecteMembers(mems);
        console.log("selectedMembers: " + selectedMembers);
    }

    const handleSelectCategories = (selectedOptions) => {
        console.log("selectedOptions: " + JSON.stringify(selectedOptions));
        const selectedValues = selectedOptions ? selectedOptions : '';
        categry = selectedValues.value
        setSelectedCategories(categry);
    }

    const options = members.map((member) => ({
        value: member._id,
        label: member.username
    }));

    const cats = categories.map((cat) => ({
        value: cat._id,
        label: cat.name
    }));

    const AddTransactionHandler = async(e) => {
        e.preventDefault();
        //setSelecteMembers(mems);
        //setSelectedCategories(categry);
        openTransactionPopup();
        console.log("desc: " + description);
        console.log("amount: " + amount);
        console.log("members: " + selectedMembers);
        console.log("category: " + selectedCategories);
        var membersOwing = {};
        var dividedAmount = Number(amount)/selectedMembers.length
        for(let i in selectedMembers){
            membersOwing[selectedMembers[i]] = Math.round(dividedAmount, 2);
        }
        console.log("membersOwing: " + membersOwing);
        const response = await axios.post("http://localhost:3000/api/users/add-transaction", {description, category:selectedCategories, groupId, members:membersOwing, amount, userId: Cookies.get('userId')});
        console.log(response);
        setRefreshData(!refreshData);
    }

    return(
        <div>
            <Header OpenSidebar={OpenSidebar}/>
            <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
            <div className="group-container">
                <h1>{groupName}</h1>
                <h2>{message}</h2>
            </div>
            <div className="buttons-container">
                    <button class="butn" onClick={openTransactionPopup}>Record Transaction</button>
                    <button class="butn">view balances</button>
                    <button class="butn">Add Member</button>
            </div>

            {transactionPopup && (
                <div className="popup">
                    <div className="popup-overlay">
                        <div className="popup-content">
                            <div className="nv">
                                <h2>Record Transaction</h2>
                                <label className="close" onClick={openTransactionPopup}>X</label>
                            </div>
                            <form className="form" onSubmit={AddTransactionHandler}>
                                <input className="desc" type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)}/>
                                <input className="amt" type="text"placeholder="Amount" onChange={(e) => setAmount(e.target.value)}/>
                                <div className="select">
                                    <label>Select Members</label>
                                    <Select className="sel" isMulti options={options}  
                                       onChange={handleSelectChange}
                                    />
                                    <label>Select Category</label>
                                    <Select options={cats}  onChange={handleSelectCategories} 
                                        
                                    />
                                </div>
                                
                                <button type="submit" className="add">Add Transaction</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {
                groupTransactions.map((transaction) => (
                    <GroupTransactions key={transaction._id} transactionId={transaction._id} title={transaction.description} amount={transaction.amount} includedMembers={transaction.includedMembers} paidBy={transaction.user}/>
                ))
            }
        </div>
    )
}

export default Group;