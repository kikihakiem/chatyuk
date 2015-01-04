var LoggedInBox = React.createClass({
  render: function() {
    return (
      <span> Logged in as {this.props.username} in {this.props.room} <input type="button" value="Logout" onClick={this.props.logout} /> </span>
    );
  }
});

var LoginForm = React.createClass({
  doLogin: function(e) {
    e.preventDefault();
    var username = this.refs.username.getDOMNode().value.trim();
    var room = this.refs.room.getDOMNode().value.trim();
    this.props.loggedInAs(username, room)
  },
  render: function() {
      return (<form  onSubmit={this.doLogin}>
        <label htmlFor='username'>Username:</label>
        <input type='text' ref='username' defaultValue={this.props.username}/>
        <label htmlFor='room'>Room:</label>
        <input type='text' ref='room' defaultValue={this.props.room}/>
        <input type='submit' value='Join!'/>
      </form> )
  }
});

var MessagePane = React.createClass({
  componentDidMount: function() {
    this.props.comms.setOnMessageCb(this.addMessage);
  },

  getInitialState: function() {
    var messages = []
    if(typeof(this.props.messages) != 'undefined') {
      messages = this.props.messages;
    }
    return {
      messages: messages
    };
  },

  addMessage: function(message) {
    var messages = this.state.messages;
    messages.push(message);
    this.setState({messages: messages});
  },

  render: function() {
    var messageNodes = this.state.messages.map(function(message, index) {
      return (
        <Message sender={message.sender} body={message.body} key={index} />
      )
    });

    return (
        <ul className="chat-content">
          {messageNodes}
        </ul>
    );
  }
});

var Message = React.createClass({
  render: function() {
    return(
      <li className='chat-message'>
        <span className="chat-message-room">{this.props.sender}:</span>
        <span className="chat-message-content">{this.props.body}</span>
      </li>
    );
  }
});

var MessageBox = React.createClass({
  sendMessage: function(e) {
    if(e.which == 13) {
      e.preventDefault();
      this.props.comms.groupchat(e.target.value)
      e.target.value = '';
    }
  },
  render: function() {
      return (<form className="sendXMPPMessage"> <textarea placeholder="Message" className="chat-textarea" onKeyPress={this.sendMessage}></textarea></form>)
  }
});

var ChatBox = React.createClass({

  render: function() {
    return (
         <div className="chatroom">
           <div className="box-flyout" >
             <div className="dragresize dragresize-tm"></div>
             <div className="chat-head chat-head-chatroom">
                <a className="toggle-chatbox-button icon-minus"></a>
                <div className="chat-title"> Chatroom </div>
                <p className="chatroom-topic">May the force be with you</p>
            </div>
             <div className="chat-body" >
             <div className="chat-area">
             {this.props.children}
             </div>
           </div>
         </div>
       </div>
     );
  }
});


var ChatArea = React.createClass({
  getInitialState: function() {
    return {
      loggedIn: this.props.comms.isConnected(),
      username: this.props.comms.username,
      room: this.props.comms.room
    };
  },

  updateState: function() {
    this.setState({
      loggedIn: this.props.comms.isConnected(),
      username: this.props.comms.username,
      room: this.props.comms.room
    });
  },

  loggedInAs: function(username, room) {
    this.props.comms.connect(username, '', room, this.updateState, this.updateState);
  },

  logout: function() {
    this.props.comms.disconnect();
    this.setState({loggedIn: false, username: null, room: null})
  },

  render: function() {

    if(this.props.comms.isConnected()) { 
      return (
        <ChatBox>
          <MessagePane comms={this.props.comms} />
          <MessageBox comms={this.props.comms} />
          <LoggedInBox logout={this.logout} username={this.state.username} room={this.state.room} />
        </ChatBox>
      );
    } else {
      return (
        <ChatBox>
         <LoginForm loggedInAs={this.loggedInAs} username="test" room="testroom" />
        </ChatBox>
      );
    }
  }
});