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

const TransactionPopup = (props) => {
    if(!props.transactionPopup) return null;
    return(
        <div>
            <div className="popup-overlay">
                <div className="popup-content">
                    <form>
                        <button onClick={props.openTransactionPopup}>Close</button>
                        <input type="text" placeholder="Description"/>
                        <input type="text"placeholder="Amount"/>
                        <button>Add Transaction</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default TransactionPopup;