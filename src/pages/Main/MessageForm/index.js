import { gql, useMutation } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { makeStyles, TextField } from "@material-ui/core";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { selectedUserState } from "../../../recoil";

const INSERT_MESSAGE = gql`
  mutation MyMutation(
    $toUserId: String = ""
    $message: String = ""
    $fromUserId: String = ""
  ) {
    insert_messages_one(
      object: {
        fromUserId: $fromUserId
        toUserId: $toUserId
        message: $message
      }
    ) {
      id
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  messageForm: {
    overflow: "hidden",
    margin: "16px",
    padding: "0",
  },
  underline: {
    "&&&:before": {
      borderBottom: "none",
    },
    "&&:after": {
      borderBottom: "none",
    },
  },
  input: {
    color: "white",
  },
}));

const MessageForm = () => {
  const classes = useStyles();
  const { user } = useAuth0();
  const [message, setMessage] = useState("");
  const [selectedUser] = useRecoilState(selectedUserState);

  const [insertMessage] = useMutation(INSERT_MESSAGE, {
    variables: {
      fromUserId: user?.sub,
      message: message,
      toUserId: selectedUser?.id,
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    insertMessage();
    setMessage("");
  };

  return (
    <form
      className={classes.messageForm}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextField
        InputProps={{ classes }}
        id="input-message"
        placeholder="Type a message..."
        fullWidth={true}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ background: "#333b49", color: "#fff" }}
      />
    </form>
  );
};

export default MessageForm;
