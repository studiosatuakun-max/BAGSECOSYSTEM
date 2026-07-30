using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RfidSdk;

namespace RfidReader
{
    class RfidRspNotify : RfidSdk.RfidReaderRspNotify
    {
        Form1 mainWindows;
        public RfidRspNotify(Form1 winForm)
        {
            this.mainWindows = winForm;
        }

        void RfidReaderRspNotify.OnRecvResetRsp(RfidSdk.RfidReader reader, byte result)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    mainWindows.OnRecvReaderResetRsp(reader, result);
                }));
            }
            else
            {
                mainWindows.OnRecvReaderResetRsp(reader,result);
            }
        }

        void RfidReaderRspNotify.OnRecvSetFactorySettingRsp(RfidSdk.RfidReader reader, byte result)
        {
            
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    mainWindows.OnRecvReaderRestorFactorySettingRsp(reader, result);
                }));
            }
            else
            {
                mainWindows.OnRecvReaderRestorFactorySettingRsp(reader, result);
            }
        }

        void RfidReaderRspNotify.OnRecvStartInventoryRsp(RfidSdk.RfidReader reader, byte result)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    if (0 == result)
                    {
                        mainWindows.AddResultItem("Start to inventory tags.", MessageType.Normal);
                    }
                    else
                    {
                        mainWindows.AddResultItem("Fail to inventory tags.", MessageType.Error);
                    }
                }));
            }
            else
            {
                if (0 == result)
                {
                    mainWindows.AddResultItem("Start to inventory tags.", MessageType.Normal);
                }
                else
                {
                    mainWindows.AddResultItem("Fail to inventory tags.", MessageType.Error);
                }
            }
        }

        void RfidReaderRspNotify.OnRecvStopInventoryRsp(RfidSdk.RfidReader reader, byte result)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    if (result==0)
                    {
                        mainWindows.AddResultItem("Stop to inventory tags.", MessageType.Normal);
                    }
                    else
                    {
                        mainWindows.AddResultItem("Stop to inventory tags.", MessageType.Normal);
                    }
                }));
            }
            else
            {
                if (result == 0)
                {
                    mainWindows.AddResultItem("Stop to inventory tags.", MessageType.Normal);
                }
                else
                {
                    mainWindows.AddResultItem("Stop to inventory tags.", MessageType.Normal);
                }
            }
        }

        void RfidReaderRspNotify.OnRecvDeviceInfoRsp(RfidSdk.RfidReader reader, byte[] firmwareVersion, byte deviceType)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    mainWindows.OnRecvReaderDeviceInfoRsp(firmwareVersion, deviceType);
                }));
            }
            else
            {
                mainWindows.OnRecvReaderDeviceInfoRsp(firmwareVersion,deviceType);
            }
        }

        void RfidReaderRspNotify.OnRecvSetWorkParamRsp(RfidSdk.RfidReader reader, byte result)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    if (0 == result)
                    {
                        mainWindows.AddResultItem("Successfully set working parameters.", MessageType.Normal);
                    }
                    else
                    {
                        mainWindows.AddResultItem("Fail to set working parameters.", MessageType.Error);
                    }
                }));
            }
            else
            {
                if (0 == result)
                {
                    mainWindows.AddResultItem("Successfully set working parameters.", MessageType.Normal);
                }
                else
                {
                    mainWindows.AddResultItem("Fail to set working parameters.", MessageType.Error);
                }
            }
        }

        void RfidReaderRspNotify.OnRecvQueryWorkParamRsp(RfidSdk.RfidReader reader, byte result, RfidWorkParam workParam)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    mainWindows.OnRecvReaderQueryWorkParamRsp(reader,result,workParam);
                }));
            }
            else
            {
                mainWindows.OnRecvReaderQueryWorkParamRsp(reader, result, workParam);
            }
        }

        void RfidReaderRspNotify.OnRecvSetTransmissionParamRsp(RfidSdk.RfidReader reader, byte result)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    if (0 == result)
                    {
                        mainWindows.AddResultItem("Success to set transmission parameters.", MessageType.Normal);
                        mainWindows.BackToConnectMode();                
                    }
                    else
                    {
                        mainWindows.AddResultItem("Fail to stop transmission parameters.", MessageType.Error);
                    }
                }));
            }
            else
            {
                if (0 == result)
                {
                    mainWindows.AddResultItem("Success to set transmission parameters.", MessageType.Normal);
                    mainWindows.BackToConnectMode();
                }
                else
                {
                    mainWindows.AddResultItem("Fail to stop transmission parameters.", MessageType.Error);
                }
            }
        }

        void RfidReaderRspNotify.OnRecvQueryTransmissionParamRsp(RfidSdk.RfidReader reader, byte result, RfidTransmissionParam transmissiomParam)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    mainWindows.OnRecvReaderQueryTransmissionRsp(reader, result, transmissiomParam);
                }));
            }
            else
            {
                mainWindows.OnRecvReaderQueryTransmissionRsp(reader, result, transmissiomParam);
            }
        }

        void RfidReaderRspNotify.OnRecvSetAdvanceParamRsp(RfidSdk.RfidReader reader, byte result)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    if (0 == result)
                    {
                        mainWindows.AddResultItem("Success to set advance parameters.", MessageType.Normal);
                    }
                    else
                    {
                        mainWindows.AddResultItem("Fail to stop advance parameters.", MessageType.Error);
                    }
                }));
            }
            else
            {
                if (0 == result)
                {
                    mainWindows.AddResultItem("Success to set advance parameters.", MessageType.Normal);
                }
                else
                {
                    mainWindows.AddResultItem("Fail to stop advance parameters.", MessageType.Error);
                }
            }
        }

        void RfidReaderRspNotify.OnRecvQueryAdvanceParamRsp(RfidSdk.RfidReader reader, byte result, RfidAdvanceParam advanceParam)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    mainWindows.OnRecvReaderQueryAdvanceRsp(reader, result, advanceParam);
                }));
            }
            else
            {
                mainWindows.OnRecvReaderQueryAdvanceRsp(reader, result, advanceParam);
            }
        }

        //OnRecvWriteWiegandNumberRsp
        void RfidReaderRspNotify.OnRecvWriteWiegandNumberRsp(RfidSdk.RfidReader reader, byte result)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    mainWindows.OnRecvWriteWiegandNumberRsp(reader, result);
                }));
            }
            else
            {
                mainWindows.OnRecvWriteWiegandNumberRsp(reader, result);
            }
        }
        void RfidReaderRspNotify.OnRecvTagNotify(RfidSdk.RfidReader reader, TlvValueItem[] tlvItems, byte tlvCount)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    mainWindows.OnRecvTagNotify(reader, tlvItems, tlvCount);
                }));
            }
            else
            {
                mainWindows.OnRecvTagNotify(reader, tlvItems, tlvCount);
            }
        }

        void RfidReaderRspNotify.OnRecvHeartBeats(RfidSdk.RfidReader reader, TlvValueItem[] tlvItems, byte tlvCount)
        {
            return;
        }

        void RfidReaderRspNotify.OnRecvSettingSingleParam(RfidSdk.RfidReader reader, byte result)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    if (0 == result)
                    {
                        mainWindows.AddResultItem("Success to set single parameter.", MessageType.Normal);
                    }
                    else
                    {
                        mainWindows.AddResultItem("Fail to set single parameter.", MessageType.Error);
                    }
                }));
            }
            else
            {
                if (0 == result)
                {
                    mainWindows.AddResultItem("Success to set single parameter.", MessageType.Normal);
                }
                else
                {
                    mainWindows.AddResultItem("Fail to set single parameter.", MessageType.Error);
                }
            }
        }

        void RfidReaderRspNotify.OnRecvQuerySingleParam(RfidSdk.RfidReader reader, TlvValueItem item)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    mainWindows.OnRecvReaderQuerySingleParamRsp(reader, item);
                }));
            }
            else
            {
                mainWindows.OnRecvReaderQuerySingleParamRsp(reader, item);
            }
        }

        public void OnRecvWriteTagRsp(RfidSdk.RfidReader reader, byte result)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    if (result == 0)
                    {
                        mainWindows.AddResultItem("Success to write tag data.", MessageType.Normal);
                    }
                    else
                    {
                        mainWindows.AddResultItem("Fail to write tag data:"+result.ToString(), MessageType.Normal);
                    }
                }));
            }
            else
            {
                if (result == 0)
                {
                    mainWindows.AddResultItem("Success to write tag data.", MessageType.Normal);
                }
                else
                {
                    mainWindows.AddResultItem("Fail to write tag data:" + result.ToString(), MessageType.Normal);
                }
            }
        }

        void RfidReaderRspNotify.OnRecvReadBlockRsp(RfidSdk.RfidReader reader, byte result, byte[] read_data,byte[] epc_data)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    mainWindows.OnRecvReadTagBlockNotify(reader, result, read_data, epc_data);
                   
                }));
            }
            else
            {
                mainWindows.OnRecvReadTagBlockNotify(reader, result, read_data,epc_data);
            }
        }
		void RfidReaderRspNotify.OnRecvRecordNotify(RfidSdk.RfidReader reader, string time, string tagId)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    mainWindows.OnRecvRecordNotify(reader, time,tagId);
                }));
            }
            else
            {
                mainWindows.OnRecvRecordNotify(reader, time, tagId);
            }
        }

        void RfidReaderRspNotify.OnRecvRecordStatusRsp(RfidSdk.RfidReader reader, byte result)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    mainWindows.m100Windows.OnRecvRecordStatusRsp(reader, result);
                }));
            }
            else
            {
                mainWindows.m100Windows.OnRecvRecordStatusRsp(reader, result);
            }
        }

        void RfidReaderRspNotify.OnRecvSetRtcTimeStatusRsp(RfidSdk.RfidReader reader, byte result)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    mainWindows.m100Windows.OnRecvSetRtcTimeRsp(reader, result);
                }));
            }
            else
            {
                mainWindows.m100Windows.OnRecvSetRtcTimeRsp(reader, result);
            }
        }

        void RfidReaderRspNotify.OnRecvQueryRtcTimeRsp(int year, int month, int day, int hour, int min, int sec)
        {
            if (mainWindows.InvokeRequired)
            {
                mainWindows.BeginInvoke(new EventHandler(delegate
                {
                    mainWindows.m100Windows.OnRecvQueryRtcTimeRsp(year, month,day,hour,min,sec);
                }));
            }
            else
            {
                mainWindows.m100Windows.OnRecvQueryRtcTimeRsp(year, month, day, hour, min, sec);
            }
        }
    }
}
