package com.rfid.AppNotifyImpl;

import java.io.IOException;

import com.rfid.reader.AppNotify;
import com.rfid.reader.RfidReader;
import com.rfid.transport.RfidReaderManager;

public class MRfidReaderNotifyImpl implements AppNotify {
	RfidReader reader = null;
	public int NotifyRecvOneTag(RfidReader reader, String epcData,
			String tidData) {
		// TODO Auto-generated method stub
		System.out.print("Receive a tag.");
		if (epcData != null && epcData.length() != 0){
			System.out.print("EPC Area Data:" + epcData + "    ");
		}
		
		if (null != tidData && tidData.length()!= 0){
			System.out.print("TID Area Data: "+ tidData);
		}
		System.out.println();
		return 0;
	}

	public void NotifyNewTcpConnectAvailable(RfidReader reader) {
		// TODO Auto-generated method stub
		this.reader = reader;
		try {
			RfidReaderManager.getInstance().AcceptNewReaderConnect(reader);
			System.out.println("accept new reader connect.");
			//发送读卡命令，也可以不用发送
			reader.Inventory();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

	public void NotifyRebootRsp(RfidReader reader, int status) {
		// TODO Auto-generated method stub
		if (0 == status){
			System.out.println("the reader will be reboot.");
		}else {
			System.out.println("Fail to reboot.");
		}
	}

	public void NotifySetDefaultParamRsp(RfidReader reader, int status) {
		// TODO Auto-generated method stub
		
	}

	public void NotifyStartInventoryRsp(RfidReader reader, int status) {
		// TODO Auto-generated method stub
		
	}

	public void NotifyStopInventoryRsp(RfidReader reader, int status) {
		// TODO Auto-generated method stub
		
	}

	public void NotifyWriteTagRsp(RfidReader reader, int status) {
		// TODO Auto-generated method stub
		
	}

	public void NotifyReadTagRsp(RfidReader reader, int status,
			byte[] readTagData) {
		// TODO Auto-generated method stub
		
	}

	public void NotifyRemoteCloseConnection(RfidReader reader) {
		// TODO Auto-generated method stub
		System.out.println("remote "+ reader.getKey() + " disconnect.");
	}
}
