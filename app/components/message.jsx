var Emotify = require('../emotify.js');
var Linkifier = require('../linkifier.js');

var emotify = Object.create(Emotify);
var linkifier = Object.create(Linkifier);

var Message = React.createClass({

  formatSender: function(sender) {
    return sender+":";
  },

  formatBody: function(text) {
    if(text == '' || typeof text == 'undefined') {
      return '';
    }
    
    var textArray = [text];

    textArray = linkifier.parse(textArray);
    textArray = emotify.parse(textArray);

    return textArray;
  },

  render: function() {
    return(
      <li className='chat-message'>
        <span ref="sender" className="chat-message-room">{this.formatSender(this.props.sender)}</span>
        <span ref="body" className="chat-message-content" >{this.formatBody(this.props.body)}</span>
      </li>
    );
  }
});

module.exports = Message;
