import React from "react";

const UserComponent = ({ username, tasks }) => {
    return (
      <div>
        <h2>Welcome, {username}!</h2>
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>{task}</li>
          ))}
        </ul>
      </div>
    );
  };
  
export default UserComponent;