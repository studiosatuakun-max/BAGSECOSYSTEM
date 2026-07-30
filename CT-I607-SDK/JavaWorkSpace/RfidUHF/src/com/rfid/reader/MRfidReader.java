package com.rfid.reader;

import java.io.IOException;
import com.rfid.AppNotifyImpl.MRfidReaderNotifyImpl;
import com.rfid.transport.RfidReaderManager;

public class MRfidReader extends RfidReader {
	private static final int tlv_err_format = 0x00;
	private static final int tlv_tag_epc = 0x01;
	private static final int tlv_tag_user = 0x02;
	private static final int tlv_tag_reserve = 0x03;
	private static final int tlv_tag_tid = 0x04;
	private static final int tlv_rssi = 0x05;
	private static final int tlv_time = 0x06;
	private static final int tlv_response_status = 0x07;
	private static final int tlv_operation_info = 0x08;
	private static final int tlv_local_address = 0x09;
	private static final int tlv_software_version = 0x20;
	private static final int tlv_device_type = 0x21;
	private static final int tlv_working_param = 0x23;
	private static final int tlv_transport_param = 0x24;
	private static final int tlv_advance_param = 0x25;
	private static final int tlv_single_param = 0x26;
	private static final int tlv_single_tag_info = 0x50;
	private static final int tlv_single_record_data = 0x51;
	
	private static final int cmd_code_reboot = 0x10;
	private static final int cmd_restore_factory_param = 0x12;
	private static final int cmd_start_inventory = 0x21;
	private static final int cmd_stop_inventory = 0x23;
	private static final int cmd_write_tag = 0x30;
	private static final int cmd_read_tag = 0x31;
	private static final int cmd_set_work_param = 0x41;
	private static final int cmd_query_work_param = 0x42;
	private static final int cmd_query_transport_param = 0x43;
	private static final int cmd_set_transport_param = 0x44;
	private static final int cmd_set_single_param = 0x48;
	private static final int cmd_query_single_param = 0x49;
	
	private static final int notify_recv_tag = (byte)0x80;
	private byte[] readerId = null;

	public static final int exc_success = 0x00;
	public static final int exc_err_device_busy = 0x02;
	public static final int exc_err_unsupport_param = 0x14;
	public static final int exc_err_param_len = 0x18;
	public static final int exc_err_check_sum = 0x20;
	public static final int exc_err_unsupport_tlv = 0x21;
	public static final int exc_err_write_flash = 0x22;
	public static final int exc_err_detect_no_tag = 0x23;
	public static final int exc_err_password = 0x24;
	public static final int exc_err_access_out_range = 0x25;
	public static final int exc_err_internal = 0xff;
	
	public MRfidReader()
	{
		readerId = new byte[2];
		readerId[0] = 0;
		readerId[1] = 0;
	}
	
	private int GetIntValue(byte value){
		return value & 0xFF;
	}
	private byte CaculateCheckSum(byte []message,int start_pos,int len)
	{
		long checksum = 0;
		int iIndex = 0;
		for (iIndex = 0;iIndex < len; iIndex++)
		{
			checksum += getUnsignedByte(message[start_pos+iIndex]);
		}
		checksum = ~checksum + 1;
		return (byte)(checksum & 0xFF);
	}

	private void FillLengthAndCheksum() {
		int indeedLen = sendIndex + 1 - 6;
		sendMsgBuff[6] = (byte)(indeedLen >> 8);
		sendMsgBuff[7] = (byte)indeedLen;
		sendMsgBuff[sendIndex] = CaculateCheckSum(sendMsgBuff, 0, sendIndex);
		++sendIndex;
	}
	
	private void BuildMessageHeader(byte commandCode) {
		// TODO Auto-generated method stub
		sendIndex = 0;
		sendMsgBuff[sendIndex++] = 'R';
		sendMsgBuff[sendIndex++] = 'F';
		sendMsgBuff[sendIndex++] = 0;
		sendMsgBuff[sendIndex++] = readerId[0];
		sendMsgBuff[sendIndex++] = readerId[1];
		sendMsgBuff[sendIndex++] = commandCode;
		//fill length zero
		sendMsgBuff[sendIndex++] = 0;
		sendMsgBuff[sendIndex++] = 0;
	}
	
	@Override
	public int Inventory() throws IOException {
		// TODO Auto-generated method stub
		if (null == transport)
		{
			return -1;
		}
		BuildMessageHeader((byte)0x21);
		FillLengthAndCheksum();
		transport.SendData(sendMsgBuff, sendIndex);
		return 0;
	}

	@Override
	public int InventoryOnce() throws IOException {
		// TODO Auto-generated method stub
		if (null == transport)
		{
			return -1;
		}
		BuildMessageHeader((byte)0x22);
		FillLengthAndCheksum();
		transport.SendData(sendMsgBuff, sendIndex);
		return 0;
	}

	@Override
	public int Stop() throws IOException {
		// TODO Auto-generated method stub
		if (null == transport)
		{
			return -1;
		}
		BuildMessageHeader((byte)0x23);
		FillLengthAndCheksum();
		transport.SendData(sendMsgBuff, sendIndex);
		return 0;
	}

	@Override
	public int Reboot() throws IOException {
		// TODO Auto-generated method stub
		if (null == transport)
		{
			return -1;
		}
		BuildMessageHeader((byte)0x10);
		FillLengthAndCheksum();
		transport.SendData(sendMsgBuff, sendIndex);
		return 0;
	}

	@Override
	public int ReadTagBlock(byte membank, byte addr, byte len) throws IOException {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int WriteTagBlock(byte membank, byte addr, byte len, byte[] writtenData, int writeStartIndex)
			throws IOException {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int LockTag(byte lockType) throws IOException {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int KillTag() throws IOException {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int HandleRecv(){
		// TODO Auto-generated method stub
		try {
			recvMsgLen = transport.ReadData(recvMsgBuff);
			if (-1 == recvMsgLen){
				RfidReaderManager.getInstance().OnTcpRemoteDisconnect(this);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
		}
		HandleMessage();
		return 0;
	}

	@Override
	public void HandleMessage() {
		// TODO Auto-generated method stub
		byte []message = recvMsgBuff;
		byte checksum = 0;
		byte caculatedChecksum = 0;
		int buffPos = 0;
		int paramLen = 0;
		while (buffPos <= recvMsgLen - 9){
			if ( GetIntValue(message[buffPos]) != 'R' && GetIntValue(message[buffPos+1]) != 'F')
			{
				buffPos++;
			}
			
			paramLen = GetIntValue(message[buffPos+6]);
			paramLen = paramLen << 8;
			paramLen += GetIntValue(message[buffPos+7]);
			if (paramLen > 255) {
				buffPos++;
				continue;
			}
			
			checksum = message[buffPos + paramLen + 8];
			caculatedChecksum = CaculateCheckSum(message,buffPos,paramLen+8);
			if (caculatedChecksum == checksum)
			{
				//校验接收到的数据正确则处理响应信息
				NotifyMessageToApp(message, buffPos);
				//处理完成后跳到下个信令
				buffPos = buffPos + paramLen + 9;
			}
			else {
				++buffPos;
			}
		}
	}

	@Override
	protected void NotifyMessageToApp(byte[] message, int startIndex) {
		// TODO Auto-generated method stub
		int pos = -1;
		MRfidReaderNotifyImpl appNotify = (MRfidReaderNotifyImpl)getAppNotify();
		if ( null == appNotify) {
			return;
		}
		if ( 1 == message[startIndex + 2])
		{
			switch(message[startIndex + 5] & 0xFF) {
			case cmd_code_reboot:
				pos = SearchTlvPos(message,startIndex,tlv_response_status);
				if (pos > 0){
					appNotify.NotifyRebootRsp(this, message[pos + 2]);
				}
				else{
					appNotify.NotifyRebootRsp(this, exc_err_unsupport_tlv);
				}
				break;
			case cmd_restore_factory_param:
				pos = SearchTlvPos(message,startIndex,tlv_response_status);
				if (pos > 0){
					appNotify.NotifySetDefaultParamRsp(this, message[pos + 2]);
				}
				else{
					appNotify.NotifySetDefaultParamRsp(this, exc_err_unsupport_tlv);
				}
				break;
			case cmd_start_inventory:
				pos = SearchTlvPos(message,startIndex,tlv_response_status);
				if (pos > 0){
					appNotify.NotifyStartInventoryRsp(this, message[pos + 2]);
				}
				else{
					appNotify.NotifyStartInventoryRsp(this, exc_err_unsupport_tlv);
				}
				break;
			case cmd_stop_inventory:
				pos = SearchTlvPos(message,startIndex,tlv_response_status);
				if (pos > 0){
					appNotify.NotifyStopInventoryRsp(this, message[pos + 2]);
				}
				else{
					appNotify.NotifyStopInventoryRsp(this, exc_err_unsupport_tlv);
				}
				break;
			case cmd_write_tag:
				pos = SearchTlvPos(message,startIndex,tlv_response_status);
				if (pos > 0){
					appNotify.NotifyWriteTagRsp(this, message[pos + 2]);
				}
				else{
					appNotify.NotifyWriteTagRsp(this, exc_err_unsupport_tlv);
				}
				break;
			case cmd_read_tag:
				HandleReadTag(message,startIndex);
				break;
			case cmd_set_work_param:
				break;
			case cmd_query_work_param:	
				break;
			}
		}
		else if (2 == message[startIndex + 2])
		{
			switch(message[startIndex+5])
			{
			case notify_recv_tag:
				TagInfo(message, startIndex);
				break;
			}
		}
	}
	
	private void HandleReadTag(byte[] message,int startIndex){
		int optPos = -1;
		int statusPos = -1;
		byte[] tagData = null;
		MRfidReaderNotifyImpl appNotify = (MRfidReaderNotifyImpl)getAppNotify();
		statusPos = SearchTlvPos(message,startIndex,tlv_response_status);
		if ( statusPos < 0){
			appNotify.NotifyReadTagRsp(this,exc_err_unsupport_tlv,null);
		}else if (message[statusPos+2] != exc_success){
			appNotify.NotifyReadTagRsp(this,message[statusPos+2],null);
		}
		
		optPos = SearchTlvPos(message,startIndex,tlv_operation_info);
		if (optPos < 0){
			appNotify.NotifyReadTagRsp(this,exc_err_unsupport_param,null);
		}else{
			//data:9
			tagData = new byte[message[optPos + 8] * 2];
			for (int index = 0; index < tagData.length; index++){
				tagData[index] = message[optPos + 9 + index];
			}
			appNotify.NotifyReadTagRsp(this,exc_success,tagData);
		}
	}
	
	private void TagInfo(byte[] message,int startIndex){
		int tagInfoPos = -1;
		int epcTlvPos = -1;
		int tidTlvPos = -1;
		MRfidReaderNotifyImpl appNotify = (MRfidReaderNotifyImpl)getAppNotify();
		tagInfoPos = SearchTlvPos(message,startIndex,tlv_single_tag_info);
		if (tagInfoPos > 0){
			String ecpTagData = "";
			String tidTagData = "";
			tidTlvPos = SearchInnerTlvPos(message,tagInfoPos + 2,GetIntValue(message[startIndex+1]),tlv_tag_tid);
			epcTlvPos = SearchInnerTlvPos(message,tagInfoPos + 2,GetIntValue(message[startIndex+1]),tlv_tag_epc);

			if (tidTlvPos > 0){
				for (int index = 0; index < (message[tidTlvPos+1] & 0xFF); index++){
					tidTagData = tidTagData + String.format("%02X", GetIntValue(message[tidTlvPos+2+index]));
				}
			}
			if (epcTlvPos > 0){
				for (int index = 0; index < (message[epcTlvPos+1] & 0xFF); index++){
					ecpTagData = ecpTagData + String.format("%02X", GetIntValue(message[epcTlvPos+2+index]));
				}
			}
			appNotify.NotifyRecvOneTag(this,ecpTagData,tidTagData);
		}
	}
	
	private int SearchTlvPos(byte[] message,int startIndex,int tlvType){
		int pos = -1;
		int paramLen = 0;
		int paramStartIndex = 0;//startIndex + 8;
		paramLen = GetIntValue(message[startIndex+6]);
		paramLen = paramLen << 8;
		paramLen = paramLen + GetIntValue(message[startIndex+7]);
		while (paramStartIndex < paramLen){
			if ( (message[(startIndex + 8) + paramStartIndex] & 0xFF) == tlvType){
				pos = (startIndex + 8) + paramStartIndex;
				break;
			}
			else
			{
				paramStartIndex = paramStartIndex +  GetIntValue(message[(startIndex + 8) + paramStartIndex + 1]) + 2;
			}
		}
		return pos;
	}
	
	private int SearchInnerTlvPos(byte[] message,int startIndex,int paramLen,int tlvType){
		int pos = -1;
		int paramStartIndex = 0;//startIndex + 8;
		while (paramStartIndex < paramLen){
			if ( (message[startIndex + paramStartIndex] & 0xFF)== tlvType){
				pos = startIndex + paramStartIndex;
				break;
			}
			else
			{
				paramStartIndex = paramStartIndex +  GetIntValue(message[(startIndex + 8) + paramStartIndex + 1]) + 2;
			}
		}
		return pos;
	}
}
