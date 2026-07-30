using RfidSdk;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace RfidReader
{
    public partial class M100Window : Form
    {
        RfidSdk.RfidReader reader;
        Form1 parentWindow;
        Dictionary<String, TagItem> tagDictionary;
        RfidWorkParam workParam;
        RfidTransmissionParam transferParam;
        RfidAdvanceParam advanceParam;
        Boolean initWorkParamFlag = false;
        Boolean initTransParamFlag = false;
        Boolean initAdvanceParamFlag = false;
        System.IO.FileStream record_file_stream = null;
        System.IO.StreamWriter record_writer = null;

        public M100Window()
        {
            InitializeComponent();
            workParam = new RfidWorkParam();
            transferParam = new RfidTransmissionParam();
            advanceParam = new RfidAdvanceParam();
            tagDictionary = new Dictionary<string, TagItem>();
            tagDictionary.Clear();
            skinWaterTextBox_address.Text = "2";
            skinComboBox_membank.SelectedIndex = 1;
            skinWater_content.Text = "01 02 03 04";
            skinWaterTextBox_length.Text = "2"; 
            skinWaterTextBox_password.Text = "00 00 00 00";
        }

        public void SetParentWindow(Form1 window)
        {
            this.parentWindow = window;
        }
        public void SetReader(RfidSdk.RfidReader reader)
        {
            this.reader = reader;
        }

        private void skinButton_start_Click(object sender, EventArgs e)
        {
            ((Form1)(this.Parent.Parent)).AddResultItem("Send start inventorying cmd.",MessageType.Normal);
            reader.StartInventory();
        }

        private void skinButton_stop_Click(object sender, EventArgs e)
        {
            ((Form1)(this.Parent.Parent)).AddResultItem("send stop inventory.", MessageType.Normal);
            reader.StopInventory();
        }


        private void DisplayOneTag(String epc_id,byte rssi,String ext_id, byte ext_id_type)
        {
            TagItem tag_item = null;
            ListViewItem item = new ListViewItem();
            item.ForeColor = Color.BurlyWood;

            try
            {
                if (ext_id_type == (byte)RfidSdk.Tlv_Attr_Code.TLV_ATTR_CODE_TID || (epc_id.Length == 0))
                {
                    tagDictionary.TryGetValue(ext_id, out tag_item);
                }
                else
                {
                    tagDictionary.TryGetValue(epc_id, out tag_item);
                }
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
                item.SubItems.Add(epc_id);
                //add extend data
                if (ext_id.Length > 0 )
                {
                    if (ext_id_type == (byte)RfidSdk.Tlv_Attr_Code.TLV_ATTR_CODE_TID)
                    {
                        item.SubItems.Add(ext_id);
                    }
                    else if (ext_id_type == (byte)RfidSdk.Tlv_Attr_Code.TLV_ATTR_CODE_USER)
                    {
                        item.SubItems.Add(ext_id);
                    }
                    else
                    {
                        item.SubItems.Add(ext_id);
                    }
                    
                }
                else
                {
                    item.SubItems.Add("");
                }
                item.SubItems.Add(rssi.ToString("X2"));
                item.SubItems.Add("1");
                /*
                item.SubItems[0].ForeColor = Color.BurlyWood;
                item.SubItems[1].ForeColor = Color.BurlyWood;
                item.SubItems[2].ForeColor = Color.BurlyWood;
                item.SubItems[3].ForeColor = Color.BurlyWood;
                */
                tag_item.viewItem = item;
                tag_item.mReadTimes = 1;
                tag_item.viewItem = skinListView_tags.Items.Add(item);
                if (ext_id_type == (byte)RfidSdk.Tlv_Attr_Code.TLV_ATTR_CODE_TID || (epc_id.Length == 0))
                {
                    tagDictionary.Add(ext_id, tag_item);
                }
                else
                {
                    tagDictionary.Add(epc_id, tag_item);
                }
                skinLabel_tag_num.Text = tagDictionary.Count.ToString();
                //skinListView_tags.Items[skinListView_tags.Items.Count - 1].EnsureVisible();
            }

        }

        //message: receive from reader
        public void InsertTagRecord(RfidSdk.RfidReader reader, TlvValueItem[] tlvItems, int tlvCount)
        {
            int index = 0;
            int tagIndex = 0;
            String tagId = "";
            byte rssi = 0;
            String ext_id = "";
            byte ext_type = 0;
            if (null == tlvItems)
            {
                return;
            }
            if (tlvItems.Length < tlvCount)
            {
                return;
            }

            for (index = 0; index < tlvCount;index++)
            {
                switch(tlvItems[index]._tlvType)
                {
                    case (byte)RfidSdk.Tlv_Attr_Code.TLV_ATTR_CODE_EPC:
                        for (tagIndex = 0; tagIndex < tlvItems[index]._tlvLen; tagIndex++)
                        {
                            tagId += tlvItems[index]._tlvValue[tagIndex].ToString("X2");
                        }
                        break;
                    case (byte)RfidSdk.Tlv_Attr_Code.TLV_ATTR_CODE_RSSI:
                        rssi = tlvItems[index]._tlvValue[0];
                        break;
                    case (byte)RfidSdk.Tlv_Attr_Code.TLV_ATTR_CODE_TID:
                    case (byte)RfidSdk.Tlv_Attr_Code.TLV_ATTR_CODE_USER:
                        ext_type = tlvItems[index]._tlvType;
                        for (tagIndex = 0; tagIndex < tlvItems[index]._tlvLen; tagIndex++)
                        {
                            ext_id += tlvItems[index]._tlvValue[tagIndex].ToString("X2");
                        }
                        break;
                }
            }
           DisplayOneTag(tagId,rssi,ext_id, ext_type);
        }
		
		 public void OnRecvRecordNodtify(RfidSdk.RfidReader reader, String time, String tagId)
        {
            if (record_writer == null)
            {
                return;
            }

            String text = time + " " + tagId;
            record_writer.WriteLine(text);
            parentWindow.AddResultItem(text, MessageType.Normal);
        }

        public void OnRecvRecordStatusRsp(RfidSdk.RfidReader reader, byte status)
        {
            record_writer.Flush();
            record_writer.Close();
            record_writer = null;
            record_file_stream.Close();
            record_file_stream = null;
            parentWindow.AddResultItem("Receive record from reader completed.",MessageType.Normal);
        }

        public void OnRecvSetRtcTimeRsp(RfidSdk.RfidReader reader, byte status)
        {
            if (status == 0)
            {
                parentWindow.AddResultItem("Success to set reader's rtc time.", MessageType.Normal);
            }
            else
            {
                parentWindow.AddResultItem("Fail to set reader's rtc time.", MessageType.Error);
            }
        }

        public void OnRecvQueryRtcTimeRsp(int year,int month,int day,int hour,int min,int sec)
        {
            StringBuilder time = new StringBuilder();
            time.AppendFormat("The reader's time: {0}.{1}.{2}  {3}:{4}:{5}", year, month, day, hour, min, sec);
            parentWindow.AddResultItem(time.ToString(), MessageType.Normal);
        }
        public void OnRecvQuerySingleParam(TlvValueItem item)
        {
            if (item._tlvValue[0] == 0x04)
            {
                UInt16 value = 0;
                String text = "";
                value = item._tlvValue[3];
                value = (UInt16)(value << 8);
                value += item._tlvValue[4];
                text = "Mixer Gain：" + item._tlvValue[1].ToString() + " , IF AMP Gain：" + item._tlvValue[2].ToString() + "  , Threshold:" + value.ToString("X4");
                ((Form1)(this.Parent.Parent)).AddResultItem(text,MessageType.Normal);
            }
        }
        public void OnRecvWorkingParamRep(RfidWorkParam newParam)
        {
            initWorkParamFlag = true;
            workParam = newParam;
            //update the interface

            skinNumericUpDown_power.Value = workParam.ucRFPower;
            if (workParam.ucInventoryArea < skinComboBox_inventory_area.Items.Count)
            {
                skinComboBox_inventory_area.SelectedIndex = workParam.ucInventoryArea;
            }
            skinWaterTextBox_inventory_address.Text = workParam.ucInventoryAddress.ToString();
            skinWaterTextBox_inventory_length.Text = workParam.ucInventoryLength.ToString();
            skinNumericUpDown_trigger_time.Value = workParam.ucAutoTrigoffTime;
            skinNumericUpDown_work_filter.Value = workParam.ucFilterTime;
            skinNumericUpDown_work_interval.Value = workParam.ucScanInterval;
            if (0 != workParam.ucBeepOnFlag)
            {
                buzzer_check.Checked = true;
            }
            else
            {
                buzzer_check.Checked = false;
            }
            skinWaterTextBox_addr.Text = workParam.usDeviceAddr.ToString();
            if (workParam.ucWorkMode < 3)
            {
                skinComboBox_work_mode.SelectedIndex = workParam.ucWorkMode;
            }
            for (int index = 0; index < 8; index++)
            {
                if ( 0 != (workParam.usAntennaFlag & (1<< index)))
                {
                    checkedListBox_work_ant.SetItemChecked(index, true);
                }
            }
            if ( 0 != workParam.ucIsEnableRecord)
            {
                record_check.Checked = true;
            }
            else
            {
                record_check.Checked = false;
            }
        }

        public void FreshTransmissionParam(RfidTransmissionParam transParam)
        {
            int index = 0;
            String strTemp;
            initTransParamFlag = true;
            transferParam = transParam;
            //update the UI
            if (transferParam.ucTransferLink <= skinComboBox_transfer_mode.Items.Count)
            {
                skinComboBox_transfer_mode.SelectedIndex = (byte)transferParam.ucTransferLink;
            }

            if (transferParam.ucBaudRate < 5)
            {
                skinComboBox_transfer_baudrate.SelectedIndex = transferParam.ucBaudRate;
            }

            //set wiegand
            if (transferParam.ucWiegandProtocol < 3)
            {
                skinComboBox_wiegand_protocl.SelectedIndex = transferParam.ucWiegandProtocol;
            }
            skinWaterTextBox_wiegand_width.Text = transferParam.ucWiegandPulseWidth.ToString();
            skinWaterTextBox_wiegand_prorid.Text = transferParam.ucWiegandPulsePeriod.ToString();
            skinWaterTextBox_wiegand_interval.Text = transferParam.ucWiegandInterval.ToString();
            skinNumericUpDown_wiegand_location.Value = transferParam.ucWiegandPosition;
            if (transferParam.ucWiegandDirection == 0)
            {
                skinComboBox_wiegand_direction.SelectedIndex = 0;
            }
            else
            {
                skinComboBox_wiegand_direction.SelectedIndex = 1;
            }
            //update tcp/ip UI
            strTemp = "";
            for (index = 0; index < 6;index++)
            {
                if (index != 5)
                {
                    strTemp += transferParam.mac_addr[index].ToString("X2") + ":";
                }
                else
                {
                    strTemp += transferParam.mac_addr[index].ToString("X2");
                }
            }
            skinWaterTextBox_ip_mac.Text = strTemp;

            if (0 != transferParam.config_ip_mode)
            {
                dhcp_check.Checked = true;
            }
            else
            {
                dhcp_check.Checked = false;
            }

            //subnet ip
            strTemp = "";
            for (index = 0; index < 4; index++)
            {
                if (index != 3)
                {
                    strTemp += transferParam.sub_mask_addr[index].ToString() + ".";
                }
                else
                {
                    strTemp += transferParam.sub_mask_addr[index].ToString();
                }
            }
            skinWaterTextBox_ip_sub_masker.Text = strTemp;

            //gate way
            strTemp = "";
            for (index = 0; index < 4; index++)
            {
                if (index != 3)
                {
                    strTemp += transferParam.gateway[index].ToString() + ".";
                }
                else
                {
                    strTemp += transferParam.gateway[index].ToString();
                }
            }
            skinWaterTextBox_gate_way.Text = strTemp;

            //local Ip
            strTemp = "";
            for (index = 0; index < 4; index++)
            {
                if (index != 3)
                {
                    strTemp += transferParam.local_ip[index].ToString() + ".";
                }
                else
                {
                    strTemp += transferParam.local_ip[index].ToString();
                }
            }
            skinWaterTextBox_ip_local.Text = strTemp;

            //remote Ip
            strTemp = "";
            for (index = 0; index < 4; index++)
            {
                if (index != 3)
                {
                    strTemp += transferParam.remote_ip_addr[index].ToString() + ".";
                }
                else
                {
                    strTemp += transferParam.remote_ip_addr[index].ToString();
                }
            }
            skinWaterTextBox_ip_remote.Text = strTemp;
            if (transferParam.ucTransferProtocol < skinComboBox_host_protocol.Items.Count)
            {
                skinComboBox_host_protocol.SelectedIndex = transferParam.ucTransferProtocol;
            }
            //remote Ip
            skinWaterTextBox_local_port.Text = transferParam.local_port.ToString();
            skinWaterTextBox_remote_port.Text = transferParam.remote_port.ToString();
            skinWaterTextBox_heart_beats.Text = transferParam.heartBeates.ToString();

            skinWaterTextBox_module_sn.Text = new String(transferParam.syris_module_sn);
            skinWaterTextBox_module_id.Text = transferParam.syris_module_id.ToString();
        }
        private void skinButton_clear_Click(object sender, EventArgs e)
        {
            tagDictionary.Clear();
            skinListView_tags.Items.Clear();
        }

        private void skinButton_work_refresh_Click(object sender, EventArgs e)
        {
            reader.QeryWorkingParam();
        }

        private void skinButton_work_set_Click(object sender, EventArgs e)
        {
            byte tempValue = 0;
            RfidWorkParam tempWorkParam = new RfidWorkParam();
            tempWorkParam.ucParamVersion = workParam.ucParamVersion;
            tempWorkParam.ucRFPower = (byte)skinNumericUpDown_power.Value;
            tempWorkParam.ucScanInterval = (byte)(skinNumericUpDown_work_interval.Value);
            tempWorkParam.ucAutoTrigoffTime = (byte)(skinNumericUpDown_trigger_time.Value);
            tempWorkParam.ucWorkMode = (byte)skinComboBox_work_mode.SelectedIndex;
            tempWorkParam.ucFilterTime = (byte)skinNumericUpDown_work_filter.Value;
            tempWorkParam.usAntennaFlag = 0;
            tempWorkParam.usDeviceAddr = Convert.ToUInt16(skinWaterTextBox_addr.Text.ToString());
            if (buzzer_check.Checked)
            {
                tempWorkParam.ucBeepOnFlag = 1;
            }
            else
            {
                tempWorkParam.ucBeepOnFlag = 0;
            }

            tempWorkParam.usAntennaFlag = 0;
            for (int index = 0; index < 8; index++)
            {
                if (checkedListBox_work_ant.GetItemChecked(index))
                {
                    tempWorkParam.usAntennaFlag |= (UInt16)(1 << index);
                }
            }
            tempWorkParam.ucInventoryArea = (byte)skinComboBox_inventory_area.SelectedIndex;
            if (true == byte.TryParse(skinWaterTextBox_inventory_address.Text,out tempValue))
            {
                tempWorkParam.ucInventoryAddress = tempValue;
            }
            else
            {
                tempWorkParam.ucInventoryAddress = 0;
            }

            if (true == byte.TryParse(skinWaterTextBox_inventory_length.Text,out tempValue))
            {
                tempWorkParam.ucInventoryLength = tempValue;
            }
            else
            {
                tempWorkParam.ucInventoryLength = 0;
            }

            if (true == record_check.Checked)
            {
                tempWorkParam.ucIsEnableRecord = 1;
            }
            else
            {
                tempWorkParam.ucIsEnableRecord = 0;
            }
            reader.SetWorkingParam(tempWorkParam);
        }

        private void skinButton_transfer_query_Click(object sender, EventArgs e)
        {
            reader.QeryTransferParam();
        }

        private void skinButton_transfer_set_Click(object sender, EventArgs e)
        {
            int index = 0;
            RfidTransmissionParam tempTransfer = new RfidTransmissionParam();
            //update the UI
            tempTransfer.ucTransferLink = (byte)skinComboBox_transfer_mode.SelectedIndex;
            tempTransfer.ucBaudRate = (byte)skinComboBox_transfer_baudrate.SelectedIndex;
            tempTransfer.ucTransferProtocol = 0;
            //set wiegand
            tempTransfer.ucWiegandProtocol = (byte)skinComboBox_wiegand_protocl.SelectedIndex;
            tempTransfer.ucWiegandPulseWidth = byte.Parse(skinWaterTextBox_wiegand_width.Text);
            tempTransfer.ucWiegandPulsePeriod = byte.Parse(skinWaterTextBox_wiegand_prorid.Text);
            tempTransfer.ucWiegandInterval = byte.Parse(skinWaterTextBox_wiegand_interval.Text);
            tempTransfer.ucWiegandPosition = (byte)skinNumericUpDown_wiegand_location.Value;
            if(skinComboBox_wiegand_direction.SelectedIndex == 0)
            {
                tempTransfer.ucWiegandDirection = 0;
            }
            else
            {
                tempTransfer.ucWiegandDirection = 1;
            }
            //update tcp/ip UI
            //mac
            String[] strMac = skinWaterTextBox_ip_mac.Text.Split(':');
            if (strMac.Length < 6)
            {
                //error MAC address
                parentWindow.AddResultItem("Please check your MAC address",MessageType.Error);
                return;
            }
            for (index = 0; index < 6; index++)
            {
                tempTransfer.mac_addr[index] = Convert.ToByte(strMac[index],16);
            }

            if (dhcp_check.Checked)
            {
                tempTransfer.config_ip_mode = 1;
            }
            else
            {
                tempTransfer.config_ip_mode = 0;
            }

            //subnet ip
            String[] strSubnet = skinWaterTextBox_ip_sub_masker.Text.Split('.');
            for (index = 0; index < 4; index++)
            {
                tempTransfer.sub_mask_addr[index] = Convert.ToByte(strSubnet[index]);
            }

            //gate way
            String[] strGateway = skinWaterTextBox_gate_way.Text.Split('.');
            for (index = 0; index < 4; index++)
            {
                tempTransfer.gateway[index] = Convert.ToByte(strGateway[index]);
            }

            //local Ip
            String[] strLocalIp = skinWaterTextBox_ip_local.Text.Split('.');
            for (index = 0; index < 4; index++)
            {
                tempTransfer.local_ip[index] = Convert.ToByte(strLocalIp[index]);
            }


            //remote Ip
            String[] strRemoteIp = skinWaterTextBox_ip_remote.Text.Split('.');
            for (index = 0; index < 4; index++)
            {
                tempTransfer.remote_ip_addr[index] = Convert.ToByte(strRemoteIp[index]);
            }

            //remote Ip
            tempTransfer.local_port = Convert.ToUInt16(skinWaterTextBox_local_port.Text);
            tempTransfer.remote_port = Convert.ToUInt16(skinWaterTextBox_remote_port.Text);
            tempTransfer.heartBeates = Convert.ToByte(skinWaterTextBox_heart_beats.Text);
            tempTransfer.ucTransferProtocol = (byte)skinComboBox_host_protocol.SelectedIndex;
            if (skinWaterTextBox_module_sn.Text.Length != 8)
            {
                parentWindow.AddResultItem("The module sn is error parameter.",MessageType.Error);
                return;
            }
            char[] sn = skinWaterTextBox_module_sn.Text.Trim().ToArray();
            for (index = 0; index < 8; index++)
            {
                tempTransfer.syris_module_sn[index] = sn[index];
            }
            if (0 == skinWaterTextBox_module_id.Text.Trim().Length)
            {
                parentWindow.AddResultItem("The module id is error parameter.", MessageType.Error);
                return;
            }
            char[] id = skinWaterTextBox_module_id.Text.ToArray();
            tempTransfer.syris_module_id = id[0];
            reader.SetTransferParam(tempTransfer);
        }

        private void skinButton_advance_refresh_Click(object sender, EventArgs e)
        {
            reader.QeryAdvanceParam();
        }

        private void skinButton_advance_set_Click(object sender, EventArgs e)
        {
            RfidAdvanceParam tempAdvanceParam = new RfidAdvanceParam();
            tempAdvanceParam.ucInitFlag = advanceParam.ucInitFlag;
            tempAdvanceParam.ucRegion = (byte)skinComboBox_advan_region.SelectedIndex;
            tempAdvanceParam.ucChannelIndex = byte.Parse(skinWaterTextBox_advan_channel.Text);
            tempAdvanceParam.ucFreqHoppingFlag = (byte)(skinComboBox_advan_hopping.SelectedIndex);
            tempAdvanceParam.ucCWFlag = (byte)(skinComboBox_advan_cw.SelectedIndex);
            tempAdvanceParam.sel_flag = (byte)(skinComboBox_advan_sel.SelectedIndex);
            tempAdvanceParam.session = (byte)(skinComboBox_advan_session.SelectedIndex);
            tempAdvanceParam.target = (byte)(skinComboBox_advan_target.SelectedIndex);
            tempAdvanceParam.QValue = (byte)skinNumericUpDown_advan_Q.Value;
            tempAdvanceParam.selectMode = (byte)(skinComboBox_advan__select_mode.SelectedIndex);
            reader.SetAdvanceParam(tempAdvanceParam);
        }

        public void FreshAdvanceParam(RfidAdvanceParam advanceParam)
        {
            this.advanceParam = advanceParam;
            initAdvanceParamFlag = true;
            //update the interface
            skinComboBox_advan_region.SelectedIndex = advanceParam.ucRegion;
            skinWaterTextBox_advan_channel.Text = advanceParam.ucChannelIndex.ToString();
            if (0 != advanceParam.ucFreqHoppingFlag)
            {
                skinComboBox_advan_hopping.SelectedIndex = 1;
            }
            else
            {
                skinComboBox_advan_hopping.SelectedIndex = 0;
            }
            if (0 != advanceParam.ucCWFlag)
            {
                skinComboBox_advan_cw.SelectedIndex = 1;
            }
            else
            {
                skinComboBox_advan_cw.SelectedIndex = 0;
            }
            skinComboBox_advan_sel.SelectedIndex = advanceParam.sel_flag;
            if (advanceParam.session < 4)
            {
                skinComboBox_advan_session.SelectedIndex = advanceParam.session;
            }

            if (0 == advanceParam.target)
            {
                skinComboBox_advan_target.SelectedIndex = 0;
            }
            else
            {
                skinComboBox_advan_target.SelectedIndex = 1;
            }
            if (advanceParam.QValue > 15)
            {
                skinNumericUpDown_advan_Q.Value = 0;
            }
            else
            {
                skinNumericUpDown_advan_Q.Value = advanceParam.QValue;
            }
            if (0 != advanceParam.selectMode)
            {
                skinComboBox_advan__select_mode.SelectedIndex = 1;
            }
            else
            {
                skinComboBox_advan__select_mode.SelectedIndex = 0;
            }
        }

        private void skinButton_defualt_Click(object sender, EventArgs e)
        {
            reader.SetDefaultParam();
        }

        private void skinButton_once_Click(object sender, EventArgs e)
        {
            reader.InventoryOnce();
        }

        private void skinButton_reset_Click(object sender, EventArgs e)
        {
            reader.ResetReader();
        }

        private void tabControl_function_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (null == reader)
            {
                return;
            }

            if (tabControl_function.SelectedIndex == 1)
            {
                //query work parameter
                if (initWorkParamFlag == false)
                {
                    reader.QeryWorkingParam();
                }
            }
            else if (tabControl_function.SelectedIndex == 2)
            {
                if (initTransParamFlag == false)
                {
                    reader.QeryTransferParam();
                }
            }
            else if (tabControl_function.SelectedIndex == 3)
            {
                if (initAdvanceParamFlag == false)
                {
                    reader.QeryAdvanceParam();
                }
            }
        }

        private void skinButton_single_Parameter_Query_Click(object sender, EventArgs e)
        {
            reader.QuerySingleParam(0x04);
        }

        private void skinButton_operation_write_Click(object sender, EventArgs e)
        {
            byte startAddr = 0;
            String[] strWrittenContent = null;
            String[] passwords = null;
            byte[] bWrittenBytes = null;
            byte writeLen = 0;
            byte[] passwrod = new byte[4];
            byte membank = 0;

            try
            {
                startAddr = byte.Parse(skinWaterTextBox_address.Text);
                strWrittenContent = skinWater_content.Text.Trim().Split(' ');
                passwords = skinWaterTextBox_password.Text.Trim().Split(' ');
                membank = (byte)skinComboBox_membank.SelectedIndex;
                bWrittenBytes = new byte[strWrittenContent.Length];
                writeLen = byte.Parse(skinWaterTextBox_length.Text.Trim());
                for (int iIndex = 0; iIndex < strWrittenContent.Length; iIndex++)
                {
                    bWrittenBytes[iIndex] = byte.Parse(strWrittenContent[iIndex], System.Globalization.NumberStyles.AllowHexSpecifier);
                }

                if (passwords.Length < 4)
                {
                    return;
                }
                for (int index = 0; index < 4; index++)
                {
                    passwrod[index] = byte.Parse(passwords[index], System.Globalization.NumberStyles.AllowHexSpecifier);
                }
            }

            catch (Exception ex)
            {
                parentWindow.AddResultItem(ex.ToString(), MessageType.Error);
                return;
            }
            if ((strWrittenContent.Length % 2) != 0)
            {
                parentWindow.AddResultItem("the length of you input is error", MessageType.Error);
            }
            else
            {
                //writeLen = (byte)(bWrittenBytes.Length / 2);
                reader.WriteTag(membank, startAddr, writeLen, bWrittenBytes, passwrod);
            }
        }

        private void skinButton_operation_read_Click(object sender, EventArgs e)
        {
            byte startAddr = 0;
            String[] passwords = null;
            byte writeLen = 0;
            byte[] passwrod = new byte[4];
            byte membank = 0;

            try
            {
                startAddr = byte.Parse(skinWaterTextBox_address.Text);
                passwords = skinWaterTextBox_password.Text.Trim().Split(' ');
                membank = (byte)skinComboBox_membank.SelectedIndex;
                writeLen = byte.Parse(skinWaterTextBox_length.Text.Trim());

                if (passwords.Length < 4)
                {
                    return;
                }
                for (int index = 0; index < 4; index++)
                {
                    passwrod[index] = byte.Parse(passwords[index], System.Globalization.NumberStyles.AllowHexSpecifier);
                }
            }

            catch (Exception ex)
            {
                parentWindow.AddResultItem(ex.ToString(), MessageType.Error);
                return;
            }
            reader.ReadTag(membank, startAddr, writeLen, passwrod);
        }

        public void OnOperationResult(String result)
        {
            skinTextBox_opt_result.Text = result;
        }

        private void skinButton_wiegand_write_Click(object sender, EventArgs e)
        {
            byte write_address = 0;
            UInt32 numberic_data = 0;
            byte[] written_data = new byte[4];
            if (null != transferParam)
            {
                if (transferParam.ucWiegandPosition > 0)
                {
                    write_address = (byte)((transferParam.ucWiegandPosition - 1) / 2  + 2);
                }
                else
                {
                    write_address = 6;
                }
            }
            {
                write_address = 6;
            }
            if(true != UInt32.TryParse(skinWaterTextBox_wiegand_write_data.Text,out numberic_data))
            {
                parentWindow.AddResultItem("Wiegand Written Data:" + skinWaterTextBox_wiegand_write_data.Text + "is illegal.", MessageType.Error);
                return;
            }
            reader.WiegandWriteTag(numberic_data,null);
        }

        private void skinButton_upload_record_Click(object sender, EventArgs e)
        {
            StringBuilder file_path = new StringBuilder();
            DateTime now = DateTime.Now;
            file_path.AppendFormat("{0}_{1}_{2}_{3}_{4}_{5}_record.txt", now.Year, now.Month, now.Day, now.Hour, now.Minute, now.Second);
            String filePath = System.AppDomain.CurrentDomain.BaseDirectory.ToString();
            filePath += "\\records\\";
            if (false == System.IO.Directory.Exists(filePath))
            {
                Directory.CreateDirectory(filePath);
            }
            filePath += file_path.ToString();

            record_file_stream = File.Open(filePath, FileMode.OpenOrCreate, FileAccess.Write);
            record_file_stream.Seek(0, SeekOrigin.Begin);
            record_file_stream.SetLength(0);
            record_writer = new StreamWriter(record_file_stream);
            reader.UploadRecord();
        }

		private void skinButton_query_time_Click(object sender, EventArgs e)
        {
            reader.QueryTime();
        }
        private void skinButton_sync_time_Click(object sender, EventArgs e)
        {
            DateTime now = DateTime.Now;
            reader.SetTime(now.Year, now.Month, now.Day, now.Hour, now.Minute, now.Second);
        }
    }

    public class TagItem
    {
        public int mIndex;
        public ListViewItem viewItem = null;
        public int mReadTimes;
        //public String mStrTag;

        public TagItem()
        {
            mIndex = 0;
            mReadTimes = 1;
            //mStrTag = "";
            viewItem = null;
        }

        public void Increase()
        {
            mReadTimes++;
        }
    }
}
