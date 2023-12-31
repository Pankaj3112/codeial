class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        this.socket = io.connect('http://50.19.136.219:8000');

        if(this.userEmail){
            this.connectionHandler();
        }
    }

    connectionHandler(){
        let self = this;
        let chatroom = undefined;

        this.socket.on('connect', () => {
            console.log('connection established using sockets...!');

            document.querySelectorAll(".chat-button").forEach((button) => {
                button.addEventListener('click', (e) => {
                    let otherUserEmail = button.getAttribute('data-id');
                    let selfUserEmail = self.userEmail;

                    chatroom = otherUserEmail < selfUserEmail ? `${otherUserEmail}-${selfUserEmail}` : `${selfUserEmail}-${otherUserEmail}`;

                    self.socket.emit('join_room', {
                        user_email: selfUserEmail,
                        chatroom: chatroom
                    });

                    document.getElementById('friend-name').innerHTML = `${otherUserEmail}`;
                });
            });

            // self.socket.emit('join_room', {
            //     user_email: self.userEmail,
            //     chatroom: chatroom 
            // });

            self.socket.on('user_joined', (data) => {
                console.log('a user joined', data);
            });
        });

        // CHANGE :: send a message on clicking the send message button
        $('#send-msg').click(function(e){
            e.preventDefault();
            let msg = $('#chat-input').val();

            if (msg != ''){
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    chatroom: chatroom  //changed this line from codeial to chatroom
                });
            }
        });

        self.socket.on('receive_message', (data) => {
            console.log('message received', data.message);

            let newMessage = "";

            if (data.user_email == self.userEmail){
                newMessage = `<div class="line-self">
                                    <div class="self">
                                        ${data.message}
                                    </div>
                                </div>`;
            }
            else{
                newMessage = `<div class="line-other">
                                    <div class="other">
                                        ${data.message}
                                    </div>
                                </div>`;
            }

            document.getElementById('message').innerHTML += newMessage;
        })
    }
}