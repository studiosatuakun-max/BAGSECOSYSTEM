package com.rfid.transport;

import java.io.IOException;
import java.net.DatagramSocket;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.DatagramChannel;

public class TransportUdp extends Transport{

	private String remoteIP;
	private int remotePort;
	
	private int localPort;
	private String localIP;
	ByteBuffer recvBuffer = null;
	public DatagramChannel  socketChannel;
	InetSocketAddress dstAddr;
	public TransportUdp() {
		remoteIP = "";
		remotePort = 0;
		localIP = "";
		localPort = 0;
		this.connectType = CONNECT_TYPE_NET_UDP;
	}
	
	public void SetConfig(String remoteIP,int remotePort,String localIP,int localPort) {
		this.localIP = localIP;
		this.localPort = localPort;
		this.remoteIP = remoteIP;
		this.remotePort = remotePort;
		dstAddr = new InetSocketAddress(this.remoteIP,this.remotePort);
	}
	
	public int RequestLocalResource() throws IOException {
		if (null != socketChannel) {
			ReleaseResource();
		}
		socketChannel = DatagramChannel.open();
		socketChannel.configureBlocking(false);
		if(localPort != 0) {
			DatagramSocket ds = socketChannel.socket();
			ds.setReceiveBufferSize(1024);
			ds.bind(new InetSocketAddress(localPort));
		}
		return 0;
	}
	
	public int SendData(byte[] datas,int length) throws IOException {
		if (null == socketChannel) {
			return -1;
		}
		ByteBuffer tmpBuffer = ByteBuffer.wrap(datas,0,length);
		socketChannel.send(tmpBuffer,dstAddr);
		return 0;
	}

	@Override
	public int ReleaseResource() throws IOException {
		// TODO Auto-generated method stub
		if (null == socketChannel) {
			return 0;
		}
		
		if ( socketChannel.isConnected()) {
			socketChannel.disconnect();
		}
		socketChannel.close();
		return 0;
	}

	@Override
	public int ReadData(byte[] datas) throws IOException {
		// TODO Auto-generated method stub
		recvBuffer = ByteBuffer.wrap(datas);
		int recvLen = 0;
		SocketAddress sourceAddr = socketChannel.receive(recvBuffer);
		recvBuffer.flip();
		recvLen = recvBuffer.remaining();
		System.out.println("receive from:"+sourceAddr.toString() + "  " + recvLen);
		return recvLen;
	}
	
	protected void finalize() throws Throwable {
		 ReleaseResource();
	}
}
