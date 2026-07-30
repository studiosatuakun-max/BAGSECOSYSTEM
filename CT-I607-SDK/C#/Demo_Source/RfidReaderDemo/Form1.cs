using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO.Ports;
using System.IO;
using System.Threading;
using ConfigureFile;
using RfidSdk;
using System.Net;

namespace RfidReader
{
    public enum MessageType
    {
        Normal = 0,
        Error = 1,
    };

    public enum Connect_Status
    {
        Status_Idl = 0,
        Status_Connecting = 1,
        Status_Connected = 2
    };
    public partial class Form1 : Form
    {
        String default_serial_num = "";
        const String ini_file_name = "download_ini.ini";
        String sys_init_path = "";
        public M100Window m100Windows = null;
        RfidSdk.RfidReader reader = null;
        RfidRspNotify rfidNotify = null;
        Connect_Status connect_status = Connect_Status.Status_Idl;
        TcpServerWindows serverWindows = null;
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            String cur_exe_path = System.Environment.CurrentDirectory + "\\" + ini_file_name;
            String tempInitValue;
            int selectValue = 0;
            sys_init_path = cur_exe_path;
            //Control.CheckForIllegalCrossThreadCalls = false;
            skinComboBox_interface.SelectedIndex = 0;
            //the response or notify message is handle in form1 object
            rfidNotify = new RfidRspNotify(this);
            RfidReaderManager manager = RfidReaderManager.Instance();

            //initialize interface
            tempInitValue = CIniFile.ReadIniKeys("configure", "interface", sys_init_path);
            if (true == int.TryParse(tempInitValue, out selectValue))
            {
                skinComboBox_interface.SelectedIndex = (selectValue > skinComboBox_interface.Items.Count) ? (skinComboBox_interface.Items.Count - 1) : selectValue;
            }
            else
            {
                skinComboBox_interface.SelectedIndex = 0;
            }
            skinButton_fresh_Click(sender, e);
            tempInitValue = CIniFile.ReadIniKeys("configure", "net_protocol", sys_init_path);
            if (true == int.TryParse(tempInitValue, out selectValue))
            {
                skinComboBox_net_protocol.SelectedIndex = (selectValue > skinComboBox_interface.Items.Count) ? (skinComboBox_interface.Items.Count - 1) : selectValue;
            }
            else
            {
                skinComboBox_net_protocol.SelectedIndex = 0;
            }

            tempInitValue = CIniFile.ReadIniKeys("configure", "remoteIP", sys_init_path);
            skinWaterTextBox_remote_ip.Text = tempInitValue;
            tempInitValue = CIniFile.ReadIniKeys("configure", "remotePort", sys_init_path);
            skinWaterTextBox_remote_port.Text = tempInitValue;
            tempInitValue = CIniFile.ReadIniKeys("configure", "localPort", sys_init_path);
            skinWaterTextBox_local_port.Text = tempInitValue;
            skinComboBox_baudrate.SelectedIndex = 4;
        }

        private void InitSysIniFile(String ini_file_path)
        {
            CIniFile.WriteIniKeys("app", "app_name", "UHF RFID Demo", ini_file_path);
            CIniFile.WriteIniKeys("configure", "serial_port_num", "0", ini_file_path);
            CIniFile.WriteIniKeys("configure", "interface", "0", ini_file_path);
            CIniFile.WriteIniKeys("configure", "remoteIP", "192.168.1.2", ini_file_path);
            CIniFile.WriteIniKeys("configure", "localPort", "9000", ini_file_path);
            CIniFile.WriteIniKeys("configure", "remotePort", "9000", ini_file_path);
            CIniFile.WriteIniKeys("configure", "serial_port_num", "COM1", ini_file_path);
        }
        private void skinButton_fresh_Click(object sender, EventArgs e)
        {
            int iIndex = 0;
            default_serial_num = CIniFile.ReadIniKeys("configure", "serial_port_num", sys_init_path);
            string[] str_ports = SerialPort.GetPortNames();
            skinComboBox_serial_port.Items.Clear();
            if (0 < str_ports.Length)
            {
                for (iIndex = 0; iIndex < str_ports.Length; iIndex++)
                {
                    skinComboBox_serial_port.Items.Add(str_ports[iIndex]);
                    if (str_ports[iIndex].Equals(default_serial_num))
                    {
                        skinComboBox_serial_port.SelectedIndex = iIndex;
                    }
                }
            }
            //AddResultItem("Serial Port fresh ok.", MessageType.Normal);
        }

        public void AddResultItem(String text, MessageType messageType)
        {
            if (listView_result.Items.Count >= 100)
            {
                listView_result.Items.Clear();
            }
            ListViewItem item = new ListViewItem();
            String result_time = DateTime.Now.ToLongTimeString();
            
            item.Text = result_time;
            item.SubItems.Add(text);
            if (messageType == MessageType.Error)
            {
                item.ForeColor = Color.Red;
               item.SubItems[1].ForeColor = Color.Red;
            }
            listView_result.Items.Add(item);
            listView_result.Items[listView_result.Items.Count - 1].EnsureVisible();
        }


        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            //write parameter into ini file
            if (null != skinComboBox_serial_port.SelectedItem)
            {
                CIniFile.WriteIniKeys("configure", "serial_port_num", skinComboBox_serial_port.SelectedItem.ToString(), sys_init_path);
            }
            CIniFile.WriteIniKeys("configure", "interface", skinComboBox_interface.SelectedIndex.ToString(), sys_init_path);
            CIniFile.WriteIniKeys("configure", "remoteIP", skinWaterTextBox_remote_ip.Text, sys_init_path);
            CIniFile.WriteIniKeys("configure", "remotePort", skinWaterTextBox_remote_port.Text.ToString(), sys_init_path);
            CIniFile.WriteIniKeys("configure", "localPort", skinWaterTextBox_local_port.Text.ToString(), sys_init_path);
            CIniFile.WriteIniKeys("configure", "net_protocol", skinComboBox_net_protocol.SelectedIndex.ToString(), sys_init_path);

            //release all resource apply before
            RfidReaderManager.Instance().DeleteAllReader();
        }

        public void UnableButton()
        {
            skinButton_fresh.Enabled = false;
        }

        public void EnableButton()
        {
            skinButton_fresh.Enabled = true;
        }

        private void skinComboBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (skinComboBox_interface.SelectedIndex == 0)
            {
                skinPanel_serialport.Show();
                skinPanel_network.Hide();
            }
            else
            {
                skinPanel_network.Location = skinPanel_serialport.Location;
                skinPanel_network.Show();
                skinPanel_serialport.Hide();
            }
        }

        public void DisplayM100Window()
        {
            if (null == m100Windows)
            {
                m100Windows = new M100Window();
            }
            if (null != serverWindows)
            {
                serverWindows.Hide();
            }
            m100Windows.TopLevel = false;
            m100Windows.Parent = this;
            //m100Windows.Location = skinPictureBox_welcom.Location;
            skinPictureBox_welcom.Controls.Add(m100Windows);
            m100Windows.SetReader(reader);
            m100Windows.Show();
        }
        public void DisplayServerWindow()
        {
            if (serverWindows == null)
            {
                serverWindows = new TcpServerWindows();
            }
            serverWindows.SetMainWin(this);
            serverWindows.TopLevel = false;
            serverWindows.Parent = this;
            //m100Windows.Location = skinPictureBox_welcom.Location;
            skinPictureBox_welcom.Controls.Add(serverWindows);
            serverWindows.Show();
        }

        public static string GetLocalIP(IPAddress remoteAddress)
        {
            byte[] localIP;
            byte[] remoteIP = remoteAddress.GetAddressBytes();
            int selectIndex = 0;
            int compare = 0;
            int lastSameCount = 0;
            IPHostEntry IpEntry;
            try
            {
                string HostName = System.Net.Dns.GetHostName(); 
                IpEntry = Dns.GetHostEntry(HostName);
                for (int i = 0; i < IpEntry.AddressList.Length; i++)
                {
                    compare = 0;
                    if (IpEntry.AddressList[i].AddressFamily == remoteAddress.AddressFamily)
                    {
                        localIP = IpEntry.AddressList[i].GetAddressBytes();
                        for (int index = 0; index < remoteIP.Length; index++)
                        {
                            if (remoteIP[index] == localIP[index])
                            {
                                compare++;
                            }
                        }
                        if (compare > lastSameCount)
                        {
                            lastSameCount = compare;
                            selectIndex = i;
                        }
                    }
                    
                }
                return IpEntry.AddressList[selectIndex].ToString();
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            
        }

        private void skinButton_connect_Click(object sender, EventArgs e)
        {
            int baudrate = 0;
            if (null != serverWindows)
            {
                serverWindows.Close();
                serverWindows = null;
            }
            if (null != reader)
            {
                RfidReaderManager.Instance().ReleaseRfidReader(reader);
                reader = null;
            }
            //close the functional windows
            if (Connect_Status.Status_Idl != connect_status)
            {
                connect_status = Connect_Status.Status_Idl;
                skinButton_net_scan.Enabled = true;
                skinButton_tcp_server.Enabled = true;
                skinButton_connect.Text = "Connect";
                if (m100Windows!= null)
                {
                    m100Windows.Close();
                    m100Windows = null;
                }
                skinPictureBox_welcom.Visible = true;
                reader = null;
                return;
            }
            
            if ( 0 == skinComboBox_interface.SelectedIndex)
            {
                String serialPortName = skinComboBox_serial_port.Text;
                if (serialPortName == null || serialPortName.Length == 0)
                {
                    AddResultItem("you have not select one connect type", MessageType.Error);
                    return;
                }
                if (skinComboBox_baudrate.SelectedItem == null)
                {
                    AddResultItem("please select the baud rate of serial port", MessageType.Error);
                    return;
                }
                connect_status = Connect_Status.Status_Connecting;
                skinButton_connect.Text = "Cancel";
                
                baudrate = int.Parse(skinComboBox_baudrate.SelectedItem.ToString());
                reader = RfidReaderManager.Instance().CreateReaderInSerialPort(serialPortName, baudrate, rfidNotify);
                if (reader != null)
                {
                    reader.QueryDeviceInfo();
                }
                else
                {
                    AddResultItem("Fail to add a pyhsical conncet to reader.", MessageType.Error);
                }
            }
            else  //the user is select RJ45
            {
                String remoteIp = skinWaterTextBox_remote_ip.Text;
                UInt16 remotePort = UInt16.Parse(skinWaterTextBox_remote_port.Text);
                String localIp;
                UInt16 localPort = 0;
                if (skinWaterTextBox_local_port.Text.Trim().Length > 0)
                {
                    localPort = UInt16.Parse(skinWaterTextBox_local_port.Text);
                } 
                RfidSdk.TransportType type;
                int connectType = skinComboBox_net_protocol.SelectedIndex;
                IPAddress remoteAddr;
                if (false == IPAddress.TryParse(remoteIp,out remoteAddr))
                {
                    AddResultItem("The IP address is error format.",MessageType.Error);
                    return;
                }
                localIp = GetLocalIP(remoteAddr);
                reader = new MSerialReader(rfidNotify);
                connect_status = Connect_Status.Status_Connecting;
                //get the connect type
                if (0 == skinComboBox_net_protocol.SelectedIndex)
                {
                    //select udp
                    type = RfidSdk.TransportType.UDP;
                }
                else
                {
                    //local client does not need configure
                    localPort = 0;
                    type = RfidSdk.TransportType.TcpClient;
                }
                reader = RfidReaderManager.Instance().CreateReaderInNet(localIp, localPort, remoteIp, remotePort, type, rfidNotify);
                if (null != reader)
                {
                    reader.QueryDeviceInfo();
                    skinButton_connect.Text = "Cancel";
                }
                else
                {
                    connect_status = Connect_Status.Status_Idl;
                    AddResultItem("Fail to add a pyhsical conncet to reader.", MessageType.Error);
                }
            }
            
        }

        public void SetNetInfo(String device_ip,String port,String local_port,String transport_mode)
        {
            skinWaterTextBox_remote_ip.Text = device_ip;
            skinWaterTextBox_remote_port.Text = port;
            skinWaterTextBox_local_port.Text = local_port;
            //{ "RS232", "RS485", "Wiegand", "UDP", "RESERVE", "TCP Client", "RESERVE", "TCP Server" };
            if (transport_mode.Equals("UDP"))
            {
                skinComboBox_net_protocol.SelectedIndex = 0;
            }
            else if (transport_mode.Equals("TCP Server"))
            {
                skinComboBox_net_protocol.SelectedIndex = 1;
            }
            else if (transport_mode.Equals("TCP Client"))
            {
                AddResultItem("The reader act as TCP client.Please click TCP Server button and set listen port " + local_port.ToString() + " to receive data.",MessageType.Normal);
            }
            else if (transport_mode.Equals("RS232") || transport_mode.Equals("RS485"))
            {
                AddResultItem("The reader transmits the tag data through the serial port.",MessageType.Normal);
            }
        }
        private void skinButton_net_scan_Click(object sender, EventArgs e)
        {
            ScanWindow scan = new ScanWindow(this);
            scan.ShowDialog(this);
        }

        private void skinButton_tcp_server_Click(object sender, EventArgs e)
        {
            DisplayServerWindow();
            return;
        }

        public void BackToConnectMode()
        {
            RfidReaderManager.Instance().ReleaseRfidReader(reader);
            reader = null;
            connect_status = Connect_Status.Status_Idl;
            skinButton_net_scan.Enabled = true;
            skinButton_tcp_server.Enabled = true;
            skinButton_connect.Text = "Connect";
            if (m100Windows != null)
            {
                m100Windows.Close();
                m100Windows = null;
            }
            skinPictureBox_welcom.Visible = true;
        }

        public void OnRecvReaderResetRsp(RfidSdk.RfidReader reader, byte status)
        {
            if (reader != this.reader)
            {
                return;
            }
            if (status == 0)
            {
                BackToConnectMode();
                AddResultItem("Success to reset the reader,please reconnect.", MessageType.Normal);
            }
            else
            {
                AddResultItem("Fail to restore factory settings,please reconnect reader.", MessageType.Error);
            }
        }

        public void OnRecvReaderRestorFactorySettingRsp(RfidSdk.RfidReader reader, byte status)
        {
            if (reader != this.reader)
            {
                return;
            }
            if (status == 0)
            {
                BackToConnectMode();
                AddResultItem("Success to restore factory settings,please reconnect reader.", MessageType.Normal);
            }
            else
            {
                AddResultItem("Fail to restore factory settings,please reconnect reader.", MessageType.Error);
            }
        }

        public void OnRecvReaderDeviceInfoRsp(byte[] firmware,byte type)
        {
            int index = 0;
            DisplayM100Window();
            StringBuilder strBuf = new StringBuilder();
            strBuf.Clear();
            skinButton_net_scan.Enabled = false;
            skinButton_tcp_server.Enabled = false;
            skinButton_connect.Text = "DisCon";
            connect_status = Connect_Status.Status_Connected;
            strBuf.Append("The reader's firmware version :");
            for (index = 0; index < firmware.Length;index++)
            {
                strBuf.Append(firmware[index]);
                if (index != firmware.Length-1)
                {
                    strBuf.Append(".");
                }
                else
                {
                    strBuf.Append(",");
                }
            }
            strBuf.Append("Type:");
            strBuf.Append(type);
            AddResultItem(strBuf.ToString(), MessageType.Normal);
        }

        public void OnRecvReaderQueryWorkParamRsp(RfidSdk.RfidReader reader,byte status, RfidWorkParam workParam)
        {
            if (reader != this.reader || m100Windows == null)
            {
                return;
            }
            if (status == 0)
            {
                m100Windows.OnRecvWorkingParamRep(workParam);
                AddResultItem("Success to query working parameters.", MessageType.Normal);
            }
            else
            {
                AddResultItem("Fail to query working parameters.", MessageType.Error);
            }
        }

        public void OnRecvReaderQueryTransmissionRsp(RfidSdk.RfidReader reader, byte status, RfidTransmissionParam transParam)
        {
            if (reader != this.reader || m100Windows == null)
            {
                return;
            }
            if (status == 0)
            {
                m100Windows.FreshTransmissionParam(transParam);
                AddResultItem("Success to query transmission parameter.", MessageType.Normal);
            }
            else
            {
                AddResultItem("Fail to query transmission parameter.", MessageType.Error);
            }
        }

        public void OnRecvReaderQueryAdvanceRsp(RfidSdk.RfidReader reader, byte status, RfidAdvanceParam advanceParam)
        {
            if (reader != this.reader || m100Windows == null)
            {
                return;
            }
            if (status == 0)
            {
                m100Windows.FreshAdvanceParam(advanceParam);
                AddResultItem("Success to query advance parameter.", MessageType.Normal);
            }
            else
            {
                AddResultItem("Fail to query advance parameter.", MessageType.Error);
            }
        }


        public void OnRecvWriteWiegandNumberRsp(RfidSdk.RfidReader reader, byte status)
        {
            if (reader != this.reader || m100Windows == null)
            {
                return;
            }
            if (status == 0)
            {
                AddResultItem("Success to write Wiegand number.", MessageType.Normal);
            }
            else
            {
                String result = String.Format("Fail to write Wiegand number.Status code:"+status.ToString("X2"));
                AddResultItem(result, MessageType.Error);
            }
        }

        public void OnRecvReaderQuerySingleParamRsp(RfidSdk.RfidReader reader, TlvValueItem item)
        {
            if (reader != this.reader || m100Windows == null)
            {
                return;
            }
            if (item == null)
            {
                AddResultItem("Fail to query advance parameter.", MessageType.Normal);
            }
            else
            {
                m100Windows.OnRecvQuerySingleParam(item);
            }
        }

        public void OnRecvTagNotify(RfidSdk.RfidReader reader, TlvValueItem[] tlvItems,byte tlvCount)
        {
            if (reader != this.reader || m100Windows == null)
            {
                return;
            }
            m100Windows.InsertTagRecord(reader, tlvItems, tlvCount);
        }
		
		public void OnRecvRecordNotify(RfidSdk.RfidReader reader, String time, String tagId)
        {
            if (reader != this.reader || m100Windows == null)
            {
                return;
            }
            m100Windows.OnRecvRecordNodtify(reader, time, tagId);
        }
		
        public void OnRecvReadTagBlockNotify(RfidSdk.RfidReader reader,byte result,byte[] data,byte[] epc_data)
        {
            String read_data="";
            if (result == 0)
            {
                for (int index = 0;index < data.Length;index++)
                {
                    read_data += data[index].ToString("X2");
                    read_data += " ";
                }
                m100Windows.OnOperationResult("Read Result:" + read_data);
                if (null != epc_data)
                {
                    read_data = "";
                    for (int index = 0; index < epc_data.Length; index++)
                    {
                        read_data += epc_data[index].ToString("X2");
                        read_data += " ";
                    }
                    AddResultItem("EPC:" + read_data, MessageType.Normal);
                }
            }
            else
            {
                AddResultItem("Fail to read the tag's block.", MessageType.Error);
            }
        }

    }
}
