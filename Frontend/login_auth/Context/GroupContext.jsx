import React, { createContext, useState, useContext } from "react";

// Create Context
const GroupContext = createContext();

// Create a provider component
export const GroupProvider = ({ children }) => {
    const [groupId, setGroupId] = useState(null);
    const [groupName, setGroupName] = useState("");
    const [members, setMembers] = useState([]);
    const [message, setMessage] = useState("");

    return (
        <GroupContext.Provider value={{ groupId, setGroupId, groupName, members, setMembers, setGroupName, message, setMessage }}>
            {children}
        </GroupContext.Provider>
    );
};


export const useGroup = () => {
    return useContext(GroupContext);
};
