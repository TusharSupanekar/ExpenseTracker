import React from "react";
import { useState,useEffect } from 'react'
import '../Styles/Dashboard.css'
import Cookies from 'js-cookie';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const GroupCard = (props) => {

    const navigate = useNavigate();
    console.log("props.groupwiseAmounts: "+props.groupwiseAmounts)
    const message = props.groupwiseAmounts[props.groupId] < 0 ? `You owe $${Math.abs(props.groupwiseAmounts[props.groupId])}` : `You are owed $${props.groupwiseAmounts[props.groupId]}`;

    const onClickHandler = async () => {
        console.log(props.groupId);
        navigate('/Group', {state: {
            groupId: props.groupId,
            groupName: props.groupName,
            members: props.members,
            message: message
          }});
        //console.log(response);
    }

    return(
        <>
            <div className='card' onClick={onClickHandler}>
                <div className='card-inner'>
                    <h3>{props.groupName}</h3>
                    <p className="subheading">{message}</p>
                    <p className="members">{props.members.length} Members</p>
                </div>
            </div>
        </>
    )
}

export default GroupCard;