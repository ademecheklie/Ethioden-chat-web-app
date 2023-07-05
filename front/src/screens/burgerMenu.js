import React, { useState, useEffect } from "react";
import { ChatList } from "./recentChatContainer";
import { ActiveData } from "../controller/activeChatData";
import { EmptyScreen } from "./emptyChat";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import GroupChat from "../components/groupchat";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { currentUser } from "../model/currentUserData";
import { DropDown } from "./DropDown";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faCommentDots, faUsers, faBullhorn, faUser, faInfoCircle, faQuestionCircle, faRobot, faSignOut,faFaceSmileWink,faClose,faHouseChimneyUser,faTree,faFaceSadTear, faPhone, faEnvelope, faSmile, faKey, faBook, faStar } from '@fortawesome/free-solid-svg-icons';
import axiosInstance from '../config/axiosConfig';
import { format } from 'date-fns';
import Bots from '../components/Bot';
import {AddMember} from '../components/createMember';
const drawerWidth = 230;

const openedMixin = (theme) => ({
  width: drawerWidth,
  backgroundColor: "#1d1f34",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "#1d1f34",
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#1d1f34",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
var listIcon = [  <FontAwesomeIcon icon={faCommentDots} />,  <FontAwesomeIcon icon={faUsers} />, <FontAwesomeIcon icon={faBullhorn} />,<FontAwesomeIcon icon={faFaceSmileWink}  />, <FontAwesomeIcon icon={faRobot} />, <FontAwesomeIcon icon={faUserPlus} />, <FontAwesomeIcon icon={faUser} />, <FontAwesomeIcon icon={faInfoCircle} />, <FontAwesomeIcon icon={faQuestionCircle} />,  <FontAwesomeIcon icon={faSignOut} /> ]
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    backgroundColor:'white',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  // }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export function MiniDrawer(props) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [statusContent, setStatusContent] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [component, setComponent] = useState(null);

  const renderComponent = () => {
    switch (activeMenu) {
      case "Private Chat":
        return (
          <ChatList
            name={activeMenu}
            sele={props.sele}
            onChatClick={props.onChatClick}
            ably={props.ably}
          />
        );
      case "Group Chat":
        return <GroupChat ably={props.ably}/>;
      case "Announcement":
        return <div>Channels</div>;
      case "Bot":
        return <Bots name={activeMenu} ably={props.ably} />;
      case "Add Members":
        return <AddMember/>;
      case "Settings":
        return null;
      case "About":
        return null;
      case "Help":
        return null;
      case "Logout":
        return null;
      default:
        return (
          <ChatList
            name={activeMenu}
            sele={props.sele}
            onChatClick={props.onChatClick}
            ably={props.ably}
          />
        );
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [popup,setpop]=useState(false)
  const handleClickOpen=()=>{
      setpop(!popup);
  }
  const closepopup=()=>{
      setpop(false);
  }
  
  const [Profilepopup,Profilesetpop]=useState(false)
  const handleClickProfileOpen=()=>{
    Profilesetpop(!Profilepopup);
  }
  const closeProfilepopup=()=>{
    Profilesetpop(false);
}

  const handleMenuItemClick = (menu) => {
    setStatusContent(menu.Status);
  };
  const handleMenuListClick = (menu) => {
    setActiveMenu(menu);
  };
  useEffect(() => {
    setComponent(renderComponent());
  }, [activeMenu])
  
 const menuLists= ['Private Chat', 'Group Chat', 'Announcement', 'Status', 'Bot', 'Add Members', 'Profile', 'About', 'Help', 'Logout']
  const Status=[
    { 
      Status:"In a meeting",
      icon:<FontAwesomeIcon icon={faUsers} style={{color:'blue',fontSize:'20px'}}/>,
      time: "- 1 hour"
     },

     { 
      Status:"Vacationing",
     icon:<FontAwesomeIcon icon={faTree}style={{color:'green',fontSize:'20px'}}/>,
     time:"- 4 hours"
    },

    {
      Status: "Vacationing",
      icon: (
        <FontAwesomeIcon
          icon={faTree}
          style={{ color: "green", fontSize: "20px" }}
        />
      ),
      time: "- 4 hours",
    },

    {
      Status: "Out of Sick",
      icon: (
        <FontAwesomeIcon
          icon={faFaceSadTear}
          style={{ color: "yellow", fontSize: "20px" }}
        />
      ),
      time: "- Today",
    },

    {
      Status: "working remotely  ",
      icon: (
        <FontAwesomeIcon
          icon={faHouseChimneyUser}
          style={{ color: "chocolate", fontSize: "20px" }}
        />
      ),
      time: "- This week",
    },
  ];
  const setStatus = () => {
    const body = {
      userId: currentUser.userId,
      label: statusContent,
      ends_at: selectedDate,
    };
    axiosInstance.post("/status", body);
  };
  const handleInputChange = (event) => {
    setStatusContent(event.target.value);
  };

  const handleDateSelection = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss");
    setSelectedDate(formattedDate);
  };
  console.log(selectedDate);

  console.log(statusContent);

  const navigate = useNavigate();
  const logoutHandler = async() => {
    await axiosInstance.patch(`/employee/${currentUser.userId}`,{"isActive": false});
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  
    navigate('/');
  };

  const iconLister = (index) => {
    console.log(index)
    if(currentUser.role !== 'admin' && index === 5 ){
      return;
    }else{
      return listIcon[index];
    }
  }
  return (
    <>
    <div className="profile ">
          <div className=" profile_icon">
              <div>
                  {Profilepopup ?
                      <div className="mainn">
                          <div className="popup">
                         <div className="popup-body">
                          <h1><FontAwesomeIcon icon={faClose} onClick={closeProfilepopup} /></h1>
                             
                              <img className="chatProfile" alt="profileImage" src={currentUser.profileImg} />
                               <h1 className='username' >{currentUser.username}</h1>
                                  </div>

                              <span><FontAwesomeIcon icon={faUser}  />  Name
                                   <h4>{currentUser.username}</h4>
                                   </span>
                                   <span><FontAwesomeIcon icon={faPhone}  />  Phone number
                                   <h4>{currentUser.phone_num}</h4>
                                   </span>  
                                   <span><FontAwesomeIcon icon={faEnvelope}  />  Email
                                   <h4>{currentUser.email}</h4>
                                   </span>  
                                   <span><FontAwesomeIcon icon={faStar}  />  Role
                                   <h4>{currentUser.role}</h4>
                                   </span> 
                                   <span><FontAwesomeIcon icon={faSmile}  />  Status
                                   <h4>{currentUser.Status}</h4>
                                   </span> 


                              

            </div>
                      </div> : ""}
              </div>
          </div>
      </div>
    
    
    
    <div className="status ">
          <div className=" Status_icon">
              <div>
                  {popup ?
                      <div className="mainn">
                          <div className="popup">

                              <div className="popup-body">
                                  <h3>Set a status</h3>
                                  <p><FontAwesomeIcon icon={faClose} onClick={closepopup} /></p>
                              </div>

                              <div className="popup-header">
                                  <input type="text" value={statusContent}  onChange={handleInputChange} />

                              </div>

                              <div className="listofstatus ">
                                  <ul>
                                      {Status.map((menu) => (
                                          <li className=""
                                              onClick={() => handleMenuItemClick(menu)}
                                              > {menu.icon} <span>   </span> {menu.Status}</li>

                                      ))}
                                  </ul>
                                  <div className="flex justify-around align-baseline">
                                      <div>Clear after: <DropDown onDateSelection={handleDateSelection} /></div>
                                      <button className='transition ease-in-out hover:-translate-y-3 rounded-lg ml-4' onClick={setStatus}>Save</button>
                                  </div>
                              </div>

                          </div>
                      </div> : ""}
              </div>
            
          </div>
        </div>
      
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {/* <AppBar position="fixed" open={open}>
                  <Toolbar>
                    
                      <IconButton
                          color="inherit"
                          aria-label="open drawer"
                          onClick={handleDrawerOpen}
                          edge="start"
                          sx={{
                              marginRight: 5,
                              ...(open && { display: 'none' }),
                          }}
                      >
                          <MenuIcon />
                      </IconButton>

                  </Toolbar>
              </AppBar> */}
              <Drawer variant="permanent" open={open}>
                  <DrawerHeader>
                  
                  { open && <div className='flex flex-col mt-3 '>
                  <img className="chatProfile" alt="profileImage" src={currentUser.profileImg} />
                  <p className='text-white mr-20 pl-3' >{currentUser.username}</p></div>}
                     {!open ? <MenuIcon  onClick={handleDrawerOpen} className='mr-4' style={{color:'white',cursor:"pointer"}}/>: <IconButton onClick={handleDrawerClose}style={{color:'white'}}>
                          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                     
                      </IconButton>}
                      
                  </DrawerHeader>
                  {/* {open ? <img className="chatProfile" alt="profileImage" src={currentUser.profileImg} />:<MenuIcon  onClick={handleDrawerOpen} style={{color:'white'}} />} */}
                      
                  <Divider />
                  <List>
                      {menuLists.map((text, index) => (
                          <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                              <ListItemButton
                                  sx={{
                                      minHeight: 60,
                                      color:'white',
                                      justifyContent: open ? 'initial' : 'center',
                                      px: 2.5,
                                  }}    onClick={()=>{text === 'Status' ? handleClickOpen() :text === 'Profile' ? handleClickProfileOpen(): text === 'Logout' ? logoutHandler() : handleMenuListClick(text)}}
                                  >
                                  <ListItemIcon
                                      sx={{
                                          minWidth: 0,
                                          color:'white',
                                         fontSize:'20px',
                                          mr: open ? 3 : 'auto',
                                          justifyContent: 'center',
                                      }}
                                  >
                                      {/* currentUser.role === "admin" ? */}
                                      {iconLister(index)} 
                                      {/* : {} */}
                                      </ListItemIcon>
                                     {currentUser.role !== 'admin' && index === 5 ?  '':<ListItemText
                                    primary={text}
                                sx={{ opacity: open ? 1 : 0 }}
                                button /> }
                           </ListItemButton>
                       </ListItem>
                      ))}
                  </List>
                  <Divider />

              </Drawer>
              <Box component="main" sx={{ flexGrow: 1,flexShrink:1 }}>
    
              <div className="flex shrink h-screen" >
                 <div className="w-2/6 ">
          {component}
          
        </div>
        <div className="w-4/6">{props.selected !==-1 ?
          <ActiveData
            ably={props.ably}
            userId={props.selected}
            username={props.selectedUser}
            messages={props.messagesData}
          />:<EmptyScreen/>}
      </div></div>
              </Box>
          </Box></>
  );
}
