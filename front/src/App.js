import "./styles/App.css";
import { useState, useEffect } from "react";
import Login from "./screens/loginScreen";
import { Route, Routes, Navigate } from "react-router-dom";

import axiosInstance from "./config/axiosConfig";
import PrivateRoutes from "./components/privateRoutes";
import { getToken, refreshToken } from "./config/tokenManager";
import { Userstatus } from "./model/Status.js";
import { currentUser } from "./model/currentUserData";
import { MiniDrawer } from "./screens/burgerMenu";

function App() {
  const [selected, setSelected] = useState(-1);
  const [messagesData, setMessageData] = useState([]);
  const [channelmessagesData, setchannelMessageData] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedChannel, setSelectedChannel] = useState({});
  const [groupmembersDetail, setGroupMembersDetail] = useState([]);
  const [image, setImage] = useState([]);
  const [chatClick, setChatClick] = useState(true);

  const isLogin = () => {
    const token = getToken();
    if (!token) {
      return false;
    }
    return true;
  };

  const chatSelectHandler = async (userId, membersDetail) => {
    try {
      axiosInstance.get(`/room/${userId}`).then((value) => {
        console.log("get room detail");
        console.log(value.data.data.members);

        setSelectedUser(value.data.data.name);
        setSelectedChannel(value.data.data);
        setGroupMembersDetail(value.data.data.members);
      });

      axiosInstance.get(`/employee/${userId}`).then((value) => {
        setSelectedUser(value.data.data.first_name);
        setImage(value.data.data.profileImage);
        console.log(value.data.data);

        axiosInstance.get(`/status/${userId}`).then((resStatus) => {
          if (resStatus.data.data.length > 0) {
            Userstatus[0].content = resStatus.data.data[0].label;
          } else {
            Userstatus[0].content = "";
          }
        });
      });

      axiosInstance
        .get(`/chat/channel?roomId=${userId}`)
        .then((response) => {
          console.log(response.data.data);
          setchannelMessageData(response.data.data);
        })
        .catch((error) => {
          console.error(error);
        });
      axiosInstance
        .get(`/chat?senderId=${currentUser.userId}&reciverId=${userId}`)
        .then((value) => {
          setMessageData(value.data.data);
        })
        .catch((error) => {
          console.error(error);
        });
      setChatClick(true);
      setSelected(userId);
    } catch (error) {
      console.log(error);
    }
  };
  const handleListItemButtonClick = () => {
    setChatClick(false);
  };
  return (
    <div className="App">
      <Routes>
        <Route element={<PrivateRoutes isLogin={isLogin} />}>
          <Route
            path="/"
            element={
              <Home
                chatClick={chatClick}
                onListItemButtonClick={handleListItemButtonClick}
                channelmessagesData={channelmessagesData}
                selectedChannel={selectedChannel}
                image={image}
                sele={selected}
                onChatClick={chatSelectHandler}
                selected={selected}
                selectedUser={selectedUser}
                messagesData={messagesData}
                members={groupmembersDetail}
              />
            }
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

function Home(props) {
  useEffect(() => {
    const refreshTokenInterval = setInterval(refreshToken, 55 * 60 * 1000);
    return () => {
      clearInterval(refreshTokenInterval);
    };
  }, []);
  return (
    <>
      <MiniDrawer
        chatClick={props.chatClick}
        onListItemButtonClick={props.onListItemButtonClick}
        image={props.image}
        channelmessagesData={props.channelmessagesData}
        selectedChannel={props.selectedChannel}
        num={props.num}
        selected={props.selected}
        selectedUser={props.selectedUser}
        messagesData={props.messagesData}
        sele={props.sele}
        onChatClick={props.onChatClick}
        members={props.members}
      />
    </>
  );
}

export default App;
