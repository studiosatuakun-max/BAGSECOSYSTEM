using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using RfidSdk;
using System.Net;
namespace RfidReader
{
    public partial class ScanWindow : Form
    {
        Boolean start = false;
        ScanReaderImpl rfidNotifyImpl = null;
        RfidSdk.RfidReader reader;
        System.Timers.Timer scanTimer;
        System.Timers.Timer ResetTimer;
        String[] transport_type = { "RS232/RS485", "Wiegand", "RJ45", "SYRIS485"};
        Boolean endThread = false;
        Dictionary<string, string> hashMap = new Dictionary<string, string>();
        Form1 mainWin;
        public ScanWindow(Form1 mainwin)
        {
            InitializeComponent();
            this.mainWin = mainwin;
            //scanThread = new Thread(ScanThread);
            //scanThread.IsBackground = true;
            rfidNotifyImpl = new ScanReaderImpl();
            rfidNotifyImpl.SetScanWind(this);
            ListLocalEthernetInterface();
            skinProgressIndicator_scan_flag.Visible = false;
            scanTimer = new System.Timers.Timer(1500); //every 1.5s broadcast message
            scanTimer.Elapsed += new System.Timers.ElapsedEventHandler(theout);
            scanTimer.AutoReset = true;
            ResetTimer = new System.Timers.Timer(1500); //every 1.5s broadcast message
            ResetTimer.Elapsed += new System.Timers.ElapsedEventHandler(ResetAllReader);
            ResetTimer.AutoReset = true;
            skinWaterTextBox_port.Text = "6000";
            EnableButton();
        }

        public void EnableButton()
        {
            skinButton_scan.Enabled = true;
            skinButton_stop.Enabled = false;
            skinButton_all_reset.Enabled = true;
        }

        public void UnableButton()
        {
            skinButton_scan.Enabled = false;
            skinButton_stop.Enabled = true;
            skinButton_all_reset.Enabled = false;
        }
        public void theout(object source, System.Timers.ElapsedEventArgs e)
        {
            reader.QeryTransferParam();
        }

        public void ResetAllReader(object source, System.Timers.ElapsedEventArgs e)
        {
            reader.ResetReader();
        }
        public void ListLocalEthernetInterface()
        {
            IPHostEntry IpEntry;
            skinComboBox_interface.Items.Clear();
            try
            {
                string HostName = System.Net.Dns.GetHostName();
                IpEntry = Dns.GetHostEntry(HostName);
                for (int i = 0; i < IpEntry.AddressList.Length; i++)
                {
                    if (AddressFamily.InterNetwork == IpEntry.AddressList[i].AddressFamily)
                    {
                        skinComboBox_interface.Items.Add(IpEntry.AddressList[i].ToString());
                    }
                }
                skinComboBox_interface.SelectedIndex = skinComboBox_interface.Items.Count - 1;
            }
            catch (Exception)
            {
            }
        }

        public void AddOneRecord(byte[] ip,UInt16 port,byte[] mac,byte type,UInt16 local_port)
        {
            ListViewItem item = new ListViewItem();
            StringBuilder strTmp = new StringBuilder();
            item.Text = "";
            int index = 0;
            //cacluate key
            strTmp.Clear();
            for (index = 0; index < 4; index++)
            {
                strTmp.Append(ip[index].ToString());
            }
            for (index = 0; index < 6; index++)
            {
                strTmp.Append(mac[index].ToString("X2"));
            }
            if (hashMap.ContainsKey(strTmp.ToString()))
            {
                //the record has been exsit
                return;
            }
            else
            {
                hashMap.Add(strTmp.ToString(), "");
            }

            strTmp.Clear();
            for (index = 0; index < 4; index++)
            {
                strTmp.Append(ip[index].ToString());
                if (index != 3)
                {
                    strTmp.Append(".");
                }
            }
            item.SubItems.Add(strTmp.ToString());
            //item.SubItems[1].Text = strTmp.ToString() ;

            strTmp.Clear();
            for (index = 0; index < 6; index++)
            {
                strTmp.Append(mac[index].ToString("X2"));
                if (index != 5)
                {
                    strTmp.Append(":");
                }
            }
            item.SubItems.Add(strTmp.ToString());
            item.SubItems.Add(port.ToString());
            if (type < 8)
            {
                //item.SubItems[4].Text = transport_type[type];
                item.SubItems.Add(transport_type[type]);
            }
            else
            {
                item.SubItems.Add("unkonw:"+type.ToString());
                //item.SubItems[4].Text = "Unknow:" + type.ToString();
            }
            item.SubItems.Add(local_port.ToString());
            skinListView_devices.Items.Add(item);
            skinListView_devices.Items[skinListView_devices.Items.Count - 1].EnsureVisible();
        }

        private void skinButton_scan_Click(object sender, EventArgs e)
        {
            String localIP = skinComboBox_interface.SelectedText;
            UInt16 localPort = 6000;
            if (skinWaterTextBox_port.Text.Length == 0)
            {
                return; 
            }
            skinListView_devices.Items.Clear();
            hashMap.Clear();
            UInt16 scanPort =UInt16.Parse(skinWaterTextBox_port.Text);
            localIP = skinComboBox_interface.SelectedItem.ToString();
            //reader = new RfidSdk.MSerialReader(rfidNotifyImpl);
            reader = RfidReaderManager.Instance().CreateReaderInNet(localIP, localPort, "255.255.255.255", scanPort, RfidSdk.TransportType.UDP, rfidNotifyImpl);
            if (reader != null)
            {
                skinProgressIndicator_scan_flag.Visible = true;
                skinProgressIndicator_scan_flag.Start();
                start = true;
                scanTimer.Start();
                UnableButton();
            }
        }

        public void ScanThread()
        {
            while(true != endThread)
            {
                if (true == start)
                {
                    reader.HandleRecvData();
                }
            }
        }

        private void skinButton_stop_Click(object sender, EventArgs e)
        {
            scanTimer.Stop();
            ResetTimer.Stop();
            start = false;
            skinProgressIndicator_scan_flag.Stop();
            skinProgressIndicator_scan_flag.Visible = false;
            start = false;
            RfidReaderManager.Instance().ReleaseRfidReader(reader);
            reader = null;
            EnableButton();
        }

        public void OnRecvQueryTransferParamRep(RfidTransmissionParam transParam)
        {
            AddOneRecord(transParam.local_ip, transParam.local_port, transParam.mac_addr, transParam.ucTransferLink,transParam.remote_port);
        }

        public void OnRecvResetParam()
        {
            scanTimer.Stop();
            ResetTimer.Stop();
            start = false;
            skinProgressIndicator_scan_flag.Stop();
            skinProgressIndicator_scan_flag.Visible = false;
            start = false;
            RfidReaderManager.Instance().ReleaseRfidReader(reader);
            reader = null;
            EnableButton();
            MessageBox.Show("You have reset a reader's parameter.");
        }

        private void ScanWindow_FormClosing(object sender, FormClosingEventArgs e)
        {
            endThread = true;
            scanTimer.Stop();
            if (reader != null)
            {
                RfidReaderManager.Instance().ReleaseRfidReader(reader);
                reader = null;
            }
        }

        private void skinButton_set_Click(object sender, EventArgs e)
        {
            if (skinListView_devices.SelectedItems.Count == 0)
            {
                return;
            }
            else if (skinListView_devices.SelectedItems.Count > 1)
            {

            }
            else
            {
                if (null != mainWin)
                {
                    RfidReaderManager.Instance().ReleaseRfidReader(reader);
                    reader = null;
                    mainWin.SetNetInfo(skinListView_devices.SelectedItems[0].SubItems[1].Text, skinListView_devices.SelectedItems[0].SubItems[3].Text,
                        skinListView_devices.SelectedItems[0].SubItems[5].Text, skinListView_devices.SelectedItems[0].SubItems[4].Text);
                    this.Close();
                }
            }
        }

        private void skinButton_all_reset_Click(object sender, EventArgs e)
        {
            String localIP = skinComboBox_interface.SelectedText;
            UInt16 localPort = 6000;
            if (skinWaterTextBox_port.Text.Length == 0)
            {
                return;
            }
            skinListView_devices.Items.Clear();
            hashMap.Clear();
            UInt16 scanPort = UInt16.Parse(skinWaterTextBox_port.Text);
            localIP = skinComboBox_interface.SelectedItem.ToString();
            //reader = new RfidSdk.MSerialReader(rfidNotifyImpl);
            reader = RfidReaderManager.Instance().CreateReaderInNet(localIP, localPort, "255.255.255.255", scanPort, RfidSdk.TransportType.UDP, rfidNotifyImpl);
            if (reader != null)
            {
                skinProgressIndicator_scan_flag.Visible = true;
                skinProgressIndicator_scan_flag.Start();
                start = true;
                ResetTimer.Start();
                UnableButton();
            }
        }
    }

    class ScanReaderImpl : RfidReaderRspNotify
    {
        ScanWindow scanWin;
        delegate void OnRecvRspDelegate(byte[] message, int messageLen);
        public void SetScanWind(ScanWindow win)
        {
            this.scanWin = win;
        }

        void RfidReaderRspNotify.OnRecvResetRsp(RfidSdk.RfidReader reader, byte result)
        {
            if (scanWin != null)
            {
                if (scanWin.InvokeRequired)
                {
                    scanWin.BeginInvoke(new EventHandler(delegate
                    {
                        scanWin.OnRecvResetParam();
                    }));

                }
                else
                {
                    scanWin.OnRecvResetParam();
                }
            }
        }

        void RfidReaderRspNotify.OnRecvSetFactorySettingRsp(RfidSdk.RfidReader reader, byte result)
        {
            
        }

        void RfidReaderRspNotify.OnRecvStartInventoryRsp(RfidSdk.RfidReader reader, byte result)
        {
            
        }

        void RfidReaderRspNotify.OnRecvStopInventoryRsp(RfidSdk.RfidReader reader, byte result)
        {
            
        }

        void RfidReaderRspNotify.OnRecvDeviceInfoRsp(RfidSdk.RfidReader reader, byte[] firmwareVersion, byte deviceType)
        {
            
        }

        void RfidReaderRspNotify.OnRecvSetWorkParamRsp(RfidSdk.RfidReader reader, byte result)
        {
            
        }

        void RfidReaderRspNotify.OnRecvQueryWorkParamRsp(RfidSdk.RfidReader reader, byte result, RfidWorkParam workParam)
        {
            
        }

        void RfidReaderRspNotify.OnRecvSetTransmissionParamRsp(RfidSdk.RfidReader reader, byte result)
        {
            
        }

        void RfidReaderRspNotify.OnRecvQueryTransmissionParamRsp(RfidSdk.RfidReader reader, byte result, RfidTransmissionParam transmissiomParam)
        {

            if (scanWin != null)
            {
                if (scanWin.InvokeRequired)
                {
                    scanWin.BeginInvoke(new EventHandler(delegate
                    {
                        scanWin.OnRecvQueryTransferParamRep(transmissiomParam);
                    }));

                }
                else
                {
                    scanWin.OnRecvQueryTransferParamRep(transmissiomParam);
                }
            }
        }

        void RfidReaderRspNotify.OnRecvSetAdvanceParamRsp(RfidSdk.RfidReader reader, byte result)
        {
            
        }

        void RfidReaderRspNotify.OnRecvQueryAdvanceParamRsp(RfidSdk.RfidReader reader, byte result, RfidAdvanceParam advanceParam)
        {
            
        }

        void RfidReaderRspNotify.OnRecvTagNotify(RfidSdk.RfidReader reader, TlvValueItem[] tlvItems, byte tlvCount)
        {
            
        }

        void RfidReaderRspNotify.OnRecvHeartBeats(RfidSdk.RfidReader reader, TlvValueItem[] tlvItems, byte tlvCount)
        {
            return;
        }

        void RfidReaderRspNotify.OnRecvSettingSingleParam(RfidSdk.RfidReader reader, byte result)
        {
            throw new NotImplementedException();
        }

        void RfidReaderRspNotify.OnRecvQuerySingleParam(RfidSdk.RfidReader reader, TlvValueItem item)
        {
            throw new NotImplementedException();
        }

        public void OnRecvWriteTagRsp(RfidSdk.RfidReader reader, byte result)
        {
            throw new NotImplementedException();
        }

        void RfidReaderRspNotify.OnRecvWriteTagRsp(RfidSdk.RfidReader reader, byte result)
        {
            throw new NotImplementedException();
        }

        void RfidReaderRspNotify.OnRecvReadBlockRsp(RfidSdk.RfidReader reader, byte result, byte[] read_data,byte[] epc_data)
        {
            throw new NotImplementedException();
        }

        void RfidReaderRspNotify.OnRecvWriteWiegandNumberRsp(RfidSdk.RfidReader reader, byte result)
        {
            throw new NotImplementedException();
        }

        public void OnRecvRecordNotify(RfidSdk.RfidReader reader, string time, string tagId)
        {
            throw new NotImplementedException();
        }

        public void OnRecvRecordStatusRsp(RfidSdk.RfidReader reader, byte result)
        {
            throw new NotImplementedException();
        }

        public void OnRecvSetRtcTimeStatusRsp(RfidSdk.RfidReader reader, byte result)
        {
            throw new NotImplementedException();
        }

        public void OnRecvQueryRtcTimeRsp(int year, int month, int day, int hour, int min, int sec)
        {
            throw new NotImplementedException();
        }
    }
}
