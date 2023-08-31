import React from 'react';

const RightSideBar = () => {
    return (
       <aside className="custom-scrollbar rightsidebar">
           <div className="flex flex-col justify-start flex-1">
                <h3 className="text-heading4-medium text-light-1">Suggested Communities</h3>
           </div>

           <div className="flex flex-col justify-start flex-1">
               <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
           </div>
       </aside>
    );
};

export default RightSideBar;