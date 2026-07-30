package com.rfid.reader;

import java.io.IOException;
import com.rfid.transport.Transport;

public abstract class RfidReader {
	private static final int MAX_RECV_BUFF_SIZE = 1024;
	private static final int MAX_SEND_BUFF_SIZE = 128;
	private String key;
	public void setKey(String key) {
		this.key = key;
	}
	public byte[] recvMsgBuff;	//接收读写器发送过来的数据
	public int recvMsgLen;	//接收到的数据长度
	private AppNotify appNotify;	//接收到响应后用于上报应用层的应用
	protected byte[] sendMsgBuff;
	protected int sendIndex;
	public int recvLen = 0;
	protected Transport transport = null;	//the type of communication with reader
	protected int connectType = 0;
	
	public RfidReader() {
		recvMsgBuff = new byte[MAX_RECV_BUFF_SIZE];
		sendMsgBuff = new byte[MAX_SEND_BUFF_SIZE];
	}
	
	public AppNotify getAppNotify() {
		return appNotify;
	}

	public void setAppNotify(AppNotify appNotify) {
		this.appNotify = appNotify;
	}
	
	public String getKey() {
		return key;
	}
	
	public int getUnsignedByte (byte data){ //将data字节型数据转换为0~255 (0xFF 即BYTE)。 
		return data&0x0FF ; 
	}
	
	public void setTransport(Transport transport)
	{
		this.transport = transport;
	}
	public Transport getTransport(){
		return transport;
	}
	
	public abstract int Inventory() throws IOException;	//开始盘寻标签
	public abstract int InventoryOnce() throws IOException;	//只盘寻一次
	public abstract int Stop() throws IOException;	//停止读标签
	public abstract int Reboot() throws IOException;	//定时模式下重启让设备开始读标签
	public abstract int ReadTagBlock(byte membank,byte addr,byte len) throws IOException;	//读取标签中的某个区域数据
	//往membank区中起始地址为addr的区域中写入长度len*2个字节的数据，被写入的数据起始位置为writtenData在writeStartIndex的位置
	public abstract int WriteTagBlock(byte membank,byte addr,byte len, byte[] writtenData,int writeStartIndex) throws IOException;
	public abstract int LockTag(byte lockType) throws IOException;	//锁定标签，锁定后无法修改标签数据
	public abstract int KillTag() throws IOException;	//销毁标签使标签不再被读取
	public abstract int HandleRecv() throws IOException;	//检测到接收数据后接收信息
	public abstract void HandleMessage();	//处理接收到的信息
	protected abstract void NotifyMessageToApp(byte[] message,int startIndex);
}
