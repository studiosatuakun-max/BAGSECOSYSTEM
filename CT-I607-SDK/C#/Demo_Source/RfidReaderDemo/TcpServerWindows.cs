using RfidSdk;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace RfidReader
{
    public partial class TcpServerWindows : Form
    {
        RfidTcpServer tcpServer;
        Form1 mainWin;
        Dictionary<String, ClientListViewItem> tcpClients = new Dictionary<string, ClientListViewItem>();
        Dictionary<String, TagItem> tagDictionary = new Dictionary<string, TagItem>();
        public TcpServerWindows()
        {
            InitializeComponent();
            ListLocalEthernetInterface();
            skinWaterTextBox_listen_port.Text = "9000";
            tcpServer = new RfidTcpServer();
            tcpServer.ClientConnected += OnNewConnected;
            tcpServer.DataReceived += OnRecvDataFromReader;
            tcpServer.ClientDisconnected += OnDisConnectConnected;
            tcpClients.Clear();
            skinButton_stop.Enabled = false;
        }

        public void SetMainWin(Form1 mainwin)
        {
            this.mainWin = mainwin;
        }
        public void ListLocalEthernetInterface()
        {
            IPHostEntry IpEntry;
            skinComboBox_pc_interface.Items.Clear();
            try
            {
                string HostName = System.Net.Dns.GetHostName();
                IpEntry = Dns.GetHostEntry(HostName);
                for (int i = 0; i < IpEntry.AddressList.Length; i++)
                {
                    if (AddressFamily.InterNetwork == IpEntry.AddressList[i].AddressFamily)
                    {
                        skinComboBox_pc_interface.Items.Add(IpEntry.AddressList[i].ToString());
                    }
                }
                skinComboBox_pc_interface.SelectedIndex = skinComboBox_pc_interface.Items.Count - 1;
            }
            catch (Exception)
            {
            }
        }

        public void AddConnectedRecord(AsyncSocketEventArgs client)
        {
            Socket clientSock = client._state.ClientSocket;
            ClientListViewItem clientItem = null;
            String key = (clientSock.RemoteEndPoint as IPEndPoint).Address.ToString() + ":" + (clientSock.RemoteEndPoint as IPEndPoint).Port.ToString();
            try
            {
                tcpClients.TryGetValue(key, out clientItem);
            }
            catch(Exception)
            {

            }
            if (null == clientItem)
            {
                ListViewItem item = new ListViewItem();
                clientItem = new ClientListViewItem();
                clientItem.item = item;
                item.SubItems.Add((clientSock.RemoteEndPoint as IPEndPoint).Address.ToString());
                item.SubItems.Add((clientSock.RemoteEndPoint as IPEndPoint).Port.ToString());
                item.SubItems.Add(DateTime.Now.ToLongTimeString());
                skinListView_ip_list.Items.Add(item);
                tcpClients.Add(key, clientItem);
            }
        }

        public void OnNewConnected(Object sender, EventArgs e)
        {
            this.Invoke(new EventHandler(delegate
            {
                mainWin.AddResultItem("A new connect is arrive.", MessageType.Normal);
                AsyncSocketEventArgs arg = (AsyncSocketEventArgs)e;
                AddConnectedRecord(arg);
            }));
        }

        public void HandleDisconnect(AsyncSocketEventArgs client)
        {
            Socket clientSock = client._state.ClientSocket;
            ClientListViewItem clientItem = null;
            String key = (clientSock.RemoteEndPoint as IPEndPoint).Address.ToString() + ":" + (clientSock.RemoteEndPoint as IPEndPoint).Port.ToString();
            try
            {
                tcpClients.TryGetValue(key, out clientItem);
            }
            catch (Exception)
            {

            }
            if (null != clientItem)
            {
                mainWin.AddResultItem(key + " disconnect.", MessageType.Normal);
                skinListView_ip_list.Items.Remove(clientItem.item);
                tcpClients.Remove(key);
            }
        }
        public void OnDisConnectConnected(Object sender, EventArgs e)
        {
            this.Invoke(new EventHandler(delegate
            {
                
                AsyncSocketEventArgs arg = (AsyncSocketEventArgs)e;
                HandleDisconnect(arg);
            }));
        }

        private void skinButton_listen_Click(object sender, EventArgs e)
        {
            if (skinWaterTextBox_listen_port.Text.Length == 0)
            {
                mainWin.AddResultItem("Please input listen port.", MessageType.Error);
                return;
            }
            skinListView_ip_list.Items.Clear();
            skinListView_tags.Items.Clear();
            UInt16 listenPort = 0;
            UInt16.TryParse(skinWaterTextBox_listen_port.Text, out listenPort);
            tcpServer.SetServerAddress(skinComboBox_pc_interface.SelectedItem.ToString(), listenPort, 128);
            try
            {
                tcpServer.Start();
            }
            catch(Exception ex)
            {
                mainWin.AddResultItem(ex.ToString(), MessageType.Error);
                return;
            }
            skinButton_stop.Enabled = true;
            skinButton_listen.Enabled = false;
            mainWin.AddResultItem("Start Listen.....",MessageType.Normal);
        }


        private void DisplayOneTag(String text, byte rssi,String readerIp)
        {
            TagItem tag_item = null;
            ListViewItem item = new ListViewItem();
            item.ForeColor = Color.BurlyWood;
            String key = readerIp + ":" + text;
            try
            {
                tagDictionary.TryGetValue(key, out tag_item);

            }
            catch (ArgumentNullException)
            {

            }
            if (null != tag_item)
            {
                tag_item.mReadTimes++;
                tag_item.viewItem.SubItems[3].Text = rssi.ToString("X2");
                tag_item.viewItem.SubItems[4].Text = tag_item.mReadTimes.ToString();
            }
            else
            {
                tag_item = new TagItem();
                item.Text = DateTime.Now.ToLongTimeString();
                item.SubItems.Add(readerIp);
                item.SubItems.Add(text);
                item.SubItems.Add(rssi.ToString("X2"));
                item.SubItems.Add("1");
                tag_item.viewItem = item;
                tag_item.mReadTimes = 1;
                tag_item.viewItem = skinListView_tags.Items.Add(item);
                tagDictionary.Add(key, tag_item);
                skinListView_tags.Items[skinListView_tags.Items.Count - 1].EnsureVisible();
            }

        }

        public void InsertOneTagRecord(byte[] message, int messageLen,String readerAddress)
        {
            int index = 0;
            int start_attr = 0;
            byte rssi = 0;
            int id_pos = 0;
            byte id_len = 0;
            byte attr_len = 0;
            String tagId = "";
            //the offset of tag's TLV is 8
            if (message[8] == 0x50)
            {
                start_attr = 10;
                //it is a UHF Rfid Tag
                while (index < message[9])
                {
                    attr_len = message[start_attr + index + 1];
                    if (message[start_attr + index] == 0x01)
                    {
                        id_pos = start_attr + index + 2;
                        id_len = message[start_attr + index + 1];
                    }
                    else if (message[start_attr + index] == 0x05)
                    {
                        rssi = message[start_attr + index + 2];
                    }
                    index += attr_len + 2;
                }

                if (0 != id_pos)
                {
                    for (index = 0; index < id_len; index++)
                    {
                        tagId += message[id_pos + index].ToString("X2");
                    }
                    DisplayOneTag(tagId, rssi, readerAddress);
                }


            }
        }

        public void HandleHearBeats(AsyncSocketEventArgs arg)
        {
            Socket clientSock = arg._state.ClientSocket;
            ClientListViewItem clientItem = null;
            String key = (clientSock.RemoteEndPoint as IPEndPoint).Address.ToString() + ":" + (clientSock.RemoteEndPoint as IPEndPoint).Port.ToString();
            try
            {
                tcpClients.TryGetValue(key, out clientItem);
            }
            catch (Exception)
            {

            }
            if (null != clientItem)
            {
                clientItem.item.SubItems[3].Text = DateTime.Now.ToLongTimeString();
            }
        }

        public void HandleRecvData(AsyncSocketEventArgs arg)
        {
            byte[] recvBuff = arg._state._recvBuffer;
            int messageLen = arg._state._messageLen;
            //only handle tag notify
            if ( (recvBuff[2] == 0x02) && (0x80 == recvBuff[5]))
            {
                String readerAddress = (arg._state.ClientSocket.RemoteEndPoint as IPEndPoint).Address.ToString() + ":" + (arg._state.ClientSocket.RemoteEndPoint as IPEndPoint).Port.ToString();
                InsertOneTagRecord(recvBuff,messageLen, readerAddress);
            }
            else if ((recvBuff[2] == 0x02) && (0x90 == recvBuff[5]))
            {
                this.Invoke(new EventHandler(delegate
                {
                    HandleHearBeats(arg);
                }));
            }
        } 
        public void OnRecvDataFromReader(Object sender, EventArgs e)
        {
            try
            {
                this.Invoke(new EventHandler(delegate
                {
                    AsyncSocketEventArgs arg = (AsyncSocketEventArgs)e;
                    HandleRecvData(arg);
                }));
            }
            catch(Exception)
            {

            }
        }

        private void skinButton_stop_Click(object sender, EventArgs e)
        {
            tcpServer.Stop();
            skinButton_listen.Enabled = true;
            skinButton_stop.Enabled = false;
            mainWin.AddResultItem("The Server stop working.", MessageType.Normal);
        }

        private void TcpServerWindows_FormClosing(object sender, FormClosingEventArgs e)
        {
            tcpServer.Stop();
        }
    }


    public class ClientListViewItem
    {
        public String _remoteIP;
        public UInt16 _remotePort;
        public ListViewItem item;

    }
}
