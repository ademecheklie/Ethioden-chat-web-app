import React from "react";
import { useState, useEffect } from "react";
import { RecentChat } from "./recentChat";
import "../styles/groupchat.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch,faArrowLeft,faPlus,faTimes, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import SearchComp from "./searchComp";
import Popup from "reactjs-popup";
import axiosConfig from "../config/axiosConfig";
import { currentUser } from "../model/currentUserData";
import { colors } from "@mui/material";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Margin } from "@mui/icons-material";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const GroupChat = (props) => {
  const [issearch, setIssearch] = useState(false);
  const [showpopup, setShowpopup] = useState(false);
  const [showuserlist, setShowuserlist] = useState(false);
  const [userList, setUserList] = useState([]);
  const [useradded, setUseradded] = useState([]);
  const [dictionary, setDictionary] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [grouplist, setGrouplist] = useState([]);
  const [groupname, setGroupname] = useState("");
  const [openErr, setOpenErr] =  useState(false);
  const [open, setOpen] = React.useState(false);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenErr(false);
    setOpen(false);
  };

  function recentClickHandler(botId, members) {
    props.onChatClick(botId, members);
  }
  useEffect(() => {
    axiosConfig.get(`/room?type=group&userId=${currentUser.userId}`).then((res) => {
      // console.log(res.data.data[0].membersDetail);
      setGrouplist(res.data.data);
    });
  }, []);
  // console.log(grouplist);
  const ListRecentgroup = grouplist.map(
    (user) => {
      // console.log(grouplist[0])
     if(grouplist !== null){
        // console.log(user.id);
       return (
           <RecentChat
           name= {props.name}
             userId={user.id}
             members={user.membersDetail}
             profileImg={
               "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBrq9rrEZy6VUsQmoeIPh6gYzS_2JqKe1i9A&usqp=CAU"
             }
             recentChat={""}
             status={undefined}
             username={user.name}
             ably={props.ably}
             sele={props.sele}
         onClick={recentClickHandler}
         // onClick={recentClickHandler}
           />
         );
     }else{
      return null;
     }
      }
    // }
  );
useEffect(() => {
  axiosConfig.get("/employee").then((res) => {
     setUserList(res.data.data);
   });
}, [])
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const handleNextButtonClick = () => {
    if(inputValue === ""){
      setOpenErr(true)
      return;
    }
    setShowpopup(false);
                        setShowuserlist(true);
    setDictionary({ ...dictionary, [inputValue]: "some value" });
    setInputValue("");
    setGroupname([inputValue]);
    // console.log(groupname)
  };

  // useEffect(() => {
  //   console.log(dictionary);
  // }, [dictionary]);

  const handleAddButtonClick = () => {
    setDictionary({ ...dictionary, [useradded]: "some value" });
    setInputValue("");
    setOpen(true);
    
    const type = "group";
    const params = {
      name: groupname,
      type: type,
      created_by: currentUser.userId,
      members: JSON.stringify(useradded),
    };

    axiosConfig
      .post("/room", params)
      .then((response) => {
        // console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

      setOpen(true);
      return;
  };
    const useraddHandler = (id) => {
      if (!useradded.includes(id)) {
        setUseradded([...useradded, id]);
      }
    };
    // useEffect(() => {
    //   console.log(useradded);
    // }, [useradded]);
  
    
  const handlePopup = () => {
    setShowpopup(true);
  };
  const searchHandler = () => {
    setIssearch(true);
  };

  const arrowclickHandler = () => {
    setIssearch(false);
  };
  const ListRecent = userList
    .filter((user) => user.id !== currentUser.userId)
    .map((user) => (
      <RecentChat
        onClick={() => 
          {useraddHandler(user.id, user.membersDetail);
          // console.log(user.id)
          }
        }
        recentChat = {user.department}
        isSelected = {useradded.includes(user.id)}
        ably={props.ably}
        key={user.id}
        userId={user.id}
        profileImg={
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBrq9rrEZy6VUsQmoeIPh6gYzS_2JqKe1i9A&usqp=CAU"
        }
        status={true}
        username={user.first_name}
      />
    ));

  return (
    <>
      <div className=" font-bold  text-base md:text-sm   border-r border-#bdbaba ">
        <div
          className={
            // issearch
            //   ? " flex-row-reverse justify-around  items-center h-14 w-full bg-profile"
              "flex justify-around items-center h-14 w -full bg-profile"
          }
        >
            <div className="text-white lg:text-xl">{props.name}</div>
          

</div>
      </div>
      <div class="max-h-[75vh] overflow-auto no-scrollbar ">
        {ListRecentgroup}
      </div>
      <Popup
        trigger={
          <div class="bg-[#1d1f34] h-[30px] w-[30px]  md:h-[40px] md:w-[40px] 
          lg:h-[45px] lg:w-[45px] xl:h-[50px] xl:w-[50px] ml-[21%] xl:ml-[28%] md:ml-[25%] lg:ml-[27%] 
          rounded-full fixed bottom-2">
          <FontAwesomeIcon
            icon={faPlus}
            class="text-[aliceblue] h-[25px] w-[30px] md:h-[35px] md:w-[40px] 
            lg:h-[40px] lg:w-[45px] xl:h-[40px] xl:w-[45px]  pt-[20%] xl:pt-[30%] md:pt-[25%] lg:pt-[28%]"
            onClick={handlePopup}
          />
        </div>
        }
        content={
          <div className="popuppage">
            <p>creat a group</p>
          </div>
        }
        position="right center"
        modal
        closeOnEscape
        closeOnDocumentClick
      />

      <div>
        <div>
          <div>
            {showpopup && (
              <div className="w-[100%] h-[120vh] fixed left-0 top-[-10px] flex justify-center items-center z-[9999] bg-[rgba(0, 0, 0, 0.5)]">
                <div className="p-[80px] pb-[50px] mb-[80px] max-w-[500px] bg-[white] rounded-lg">
                  <div className=" mt-[-60px] bg-[white] ml-[-70px] float-left">
                    <div
                      className="close-icon"
                      onClick={() => setShowpopup(false)}
                    >
                      <FontAwesomeIcon className="pl-[180%]" icon={faTimes} />
                    </div>
                    <h3 className="pb-[15%] pl-[5%] w-[250px]">
                      create a group
                    </h3>
                  </div>
                  <div className="float-left mt-[-9px] mb-[3px] bg-[black]">
                    {/* <input className="p-[15px] ml-[-50px] h-[10px] mt-[-20px] w-[400px] rounded-[2px] border-[lightskyblue]" type="text" /> */}
                    {/* <input className="groupname" type="text" /> */}
                    <input
                      required={true}
                      className="groupname"
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      autoFocus
                    />
                  </div>

                  <div>
                    {/* <button className="nextbutton" onClick={() => {setShowpopup(false),setShowuserlist(true)}}>next</button> */}
                    <button
                      className="mt-[5vh] mb-[-10vh] ml-[95%] rounded-lg "
                      onClick={() => {
                        handleNextButtonClick();
                        
                      }}
                    >
                      next
                    </button>
                    <Snackbar  open={openErr} autoHideDuration={3000} onClose={handleClose}>
            <Alert  onClose={handleClose} severity="error" sx={{ width: '100%', ml:'510px', mt:'-470px' }}>
            Group Name required!
            </Alert>
          </Snackbar>
                    
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <div>
          <div>
            {showuserlist && (
              <div className="w-[100%] h-[120vh] fixed left-0 top-0 flex justify-center items-center z-[9999] bg-[rgba(0, 0, 0, 0.5)]">
                <div className="p-[80px] pb-[50px] mb-[80px] max-w-[500px] bg-[white] rounded-lg mt-[-10px] h-[75%]">
                  <div className="mt-[-60px] float-left bg-[white] ml-[-70px]">
                    <div
                      className="close-icon"
                      onClick={() => setShowuserlist(false)}
                    >
                      <FontAwesomeIcon className="pl-[115%]" icon={faTimes} />
                    </div>
                    <h3 className="header1">choose a user</h3>
                    <div className="w-[250px] pl-[10%] max-h-[60vh] overflow-auto no-scrollbar">
                      {ListRecent}
                    </div>
                  </div>

                  <div>
                    <button
                      className="rounded-lg ml-[100%] mt-[25%] "
                      onClick={() => {
                        setShowuserlist(false);
                        handleAddButtonClick();
                      }}
                    >
                      Add
                    </button>
                    
          {/* <p>Account created success!</p> */}
                  </div>
                </div>
              </div>
            )}
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%', ml:'470px', mt:'-360px' }}>
              Group created successfully!
            </Alert>
          </Snackbar>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupChat;
