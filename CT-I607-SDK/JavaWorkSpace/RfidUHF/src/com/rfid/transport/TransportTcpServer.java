package com.rfid.transport;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.channels.ServerSocketChannel;

public class TransportTcpServer extends Transport {
	ServerSocketChannel serverChannel = null;
	int listenPort;
	
	public TransportTcpServer(){
		this.connectType = CONNECT_TYPE_NET_TCP_SERVER;
	}
	
	public void setConfig(int listenPort){
		this.listenPort = listenPort;
	}
	@Override
	public int ReleaseResource() throws IOException {
		// TODO Auto-generated method stub
		serverChannel.close();
		return 0;
	}

	@Override
	public int RequestLocalResource() throws Exception {
		// TODO Auto-generated method stub
		serverChannel = ServerSocketChannel.open();
		serverChannel.socket().bind(new InetSocketAddress(listenPort));
		serverChannel.configureBlocking(false);
		return 0;
	}

	@Override
	public int SendData(byte[] datas, int datalen) throws IOException {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int ReadData(byte[] datas) throws IOException {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	protected void finalize() throws Throwable {
		// TODO Auto-generated method stub
		ReleaseResource();
	}
	
}
