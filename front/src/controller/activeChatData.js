import { ChatUI } from "../screens/chatScreens";

export function ActiveData(props) {
  if (props.username !== undefined) {
    console.log("activeData");
    console.log(props.members);
    return (     
      <ChatUI
        image = {props.image}
        selectedChannel = {props.selectedChannel}
        name={props.name}
        ably={props.ably}
        user={props.userId}
        username={props.username}
        messages={props.messages}
        members={props.members}
      />
    );
  }
}
