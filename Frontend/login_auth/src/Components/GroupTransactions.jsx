import React from "react";
import Header from '../Components/Header'
import Sidebar from '../Components/Siderbar'
import GroupCard from "../Components/GroupCards";
import { useState,useEffect } from 'react'
import '../Styles/Group.css'
import Cookies from 'js-cookie';
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';

const GroupTransactions = (props) => {
    
    const storedUserId = Cookies.get('userId');
    const paidString = props.paidBy._id == storedUserId ? `You Paid $${props.amount}` : `${props.paidBy.username} paid $${props.amount}`;
    var lentAmt = 0;
    console.log("props.includedMembers: " + JSON.stringify(props.includedMembers));
    for(let i in props.includedMembers){
        console.log("paid: " + storedUserId + " member: " + props.includedMembers[i].includedMember._id);
        if(storedUserId != props.includedMembers[i].includedMember._id){
            console.log("Updating")
            lentAmt += props.includedMembers[i].amount;
        }
    }
 
    const lentString = props.paidBy._id == storedUserId ? `You Owe $${lentAmt}` : `${props.paidBy.username} owes $${lentAmt}`;

    return(
        <div>
            <div className="transactions">
                <h2 className="Heading">{props.title}</h2>
                <div className="grouped-text">
                    <p className="paid">{paidString}</p>
                    <p className="lent">{lentString}</p>
                </div>
                <p className="mem">{props.includedMembers.length} Members Included</p>
                <button className="settle-up">Settle Up</button>
            </div>
        </div>
    )
}

export default GroupTransactions;