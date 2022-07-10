using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SampleSignal.Hubs
{
    public class ChatMessage
    {
        public string Name { get; set; }
        public string Message { get; set; }
        public string GroupName { get; set; }

        public string FriendUniqueId { get; set; }
    }
    [HubName("letsChatHub")]
    public class LetsChatHub : Hub
    {


        //chat.server.sendGroupMessage({ Name: "ABC", Message: "Hello World", GroupName: "chatGroup1" });
        public void sendGroupMessage([Bind(Include = "Name,Message,GroupName")] ChatMessage message)
        {

            Clients.Group(message.GroupName, Context.ConnectionId).addNewGroupMessageToPage(message.Name, message.Message);

        }


        //chat.server.sendPrivateMessage({ Name: "ABC", Message: "Hello World", FriendUniqueId: "FriendUniqueId" });
        public void sendPrivateMessage(ChatMessage message)
        {
            //Context.ConnectionId returning because i dont want to display send message in right side . (Filter of message )
            Clients.Client(message.FriendUniqueId).addNewPrivateMessageToPage(message.Name, message.Message, Context.ConnectionId);
        }


        //server
        public void joinGroup(string groupName)
        {
            Groups.Add(Context.ConnectionId, groupName);
        }
        //Delete from group
        public void deleteUserFromGroup(string groupName)
        {
            Groups.Remove(Context.ConnectionId, groupName);
        }


        public void sendChatMessage(string who, string name, string message)
        {
            //who - > is who sent the msg (connection id)
            Clients.AllExcept(who).addChatMessage(name, message);

            name = Context.User.Identity.Name;

            //foreach (var connectionId in _connections.GetConnections(who))
            //{
            //    Clients.Client(connectionId).addChatMessage(name, message);
            //}
        }



        //    private readonly static ConnectionMapping<string> _connections =
        //       new ConnectionMapping<string>();
        //    public override Task OnConnected()
        //    {
        //        string name = Context.User.Identity.Name;

        //        _connections.Add(name, Context.ConnectionId);

        //        return base.OnConnected();
        //    }

        //    public override Task OnDisconnected(bool stopCalled)
        //    {
        //        string name = Context.User.Identity.Name;

        //        _connections.Remove(name, Context.ConnectionId);

        //        return base.OnDisconnected(stopCalled);
        //    }

        //    public override Task OnReconnected()
        //    {
        //        string name = Context.User.Identity.Name;

        //        if (!_connections.GetConnections(name).Contains(Context.ConnectionId))
        //        {
        //            _connections.Add(name, Context.ConnectionId);
        //        }

        //        return base.OnReconnected();
        //    }

        //}

        //public class ConnectionMapping<T>
        //{
        //    private readonly Dictionary<T, HashSet<string>> _connections =
        //        new Dictionary<T, HashSet<string>>();

        //    public int Count
        //    {
        //        get
        //        {
        //            return _connections.Count;
        //        }
        //    }

        //    public void Add(T key, string connectionId)
        //    {
        //        lock (_connections)
        //        {
        //            HashSet<string> connections;
        //            if (!_connections.TryGetValue(key, out connections))
        //            {
        //                connections = new HashSet<string>();
        //                _connections.Add(key, connections);
        //            }

        //            lock (connections)
        //            {
        //                connections.Add(connectionId);
        //            }
        //        }
        //    }

        //    public IEnumerable<string> GetConnections(T key)
        //    {
        //        HashSet<string> connections;
        //        if (_connections.TryGetValue(key, out connections))
        //        {
        //            return connections;
        //        }

        //        return Enumerable.Empty<string>();
        //    }

        //    public void Remove(T key, string connectionId)
        //    {
        //        lock (_connections)
        //        {
        //            HashSet<string> connections;
        //            if (!_connections.TryGetValue(key, out connections))
        //            {
        //                return;
        //            }

        //            lock (connections)
        //            {
        //                connections.Remove(connectionId);

        //                if (connections.Count == 0)
        //                {
        //                    _connections.Remove(key);
        //                }
        //            }
        //        }
        //    }
    }

    [HubName("chatConversationHub")]
    public class ChatConversationHub : Hub
    {
        public static void BroadcastData(string groupName)
        {
            IHubContext context = GlobalHost.ConnectionManager.GetHubContext<ChatConversationHub>();
            context.Clients.Group(groupName).refreshChatConversationData();
        }
    }

}