package com.rfid.transport;

import java.io.IOException;
public abstract class Transport {
	
	public final static int CONNECT_TYPE_SERIALPORT = 0;
	public final static int CONNECT_TYPE_NET_UDP = 1;
	public final static int CONNECT_TYPE_NET_TCP_CLIENT = 2;
	public final static int CONNECT_TYPE_NET_TCP_SERVER = 3;
	
	public final static  byte CONNECT_STATUS_DISCONNECT = 0;
	public final static byte CONNECT_STATUS_GET_LOCAL_RESOURCE = 1;
	public final static byte CONNECT_STATUS_CONNECTED = 2;
	public byte connectStatus;
	public byte connectType;
	public Transport() {
		connectStatus = CONNECT_STATUS_DISCONNECT;
	}
	public abstract int ReleaseResource() throws IOException;
	public abstract int RequestLocalResource() throws Exception;
	public abstract int SendData(byte []datas,int datalen) throws IOException;
	public abstract int ReadData(byte []datas) throws IOException;
	protected abstract void finalize() throws java.lang.Throwable;
}
