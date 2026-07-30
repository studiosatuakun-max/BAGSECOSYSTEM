package com.rfid.transport;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.SocketChannel;


public final class TransportTcpClient extends Transport {
	String remoteIp;
	int remotePort;
	String localIp;
	int localPort;
	public SocketChannel clientChannel;
	ByteBuffer recvBuffer;
	public SelectionKey selectionKey;
	public TransportTcpClient() {
		// TODO Auto-generated constructor stub
		clientChannel = null;
		recvBuffer = null;
		remoteIp = null;
		remotePort = 0;
		localIp = null;
		localPort = 0;
		this.connectType = CONNECT_TYPE_NET_TCP_CLIENT;
	}
	
	//now it doesn't support multiple network
	public void SetConfig(String remoteIp,int remotePort,String localIp,int localPort) {
		this.remoteIp = remoteIp;
		this.remotePort = remotePort;
		this.localIp = localIp;
		this.localPort = localPort;
	}

	@Override
	public int RequestLocalResource() throws IOException {
		// TODO Auto-generated method stub
		//connect to remote host
		clientChannel = SocketChannel.open();
		
		if (null != localIp && 0 != localPort) {
			clientChannel.socket().bind(new InetSocketAddress(localPort));
		}
		
		//clientChannel.connect(new InetSocketAddress(remoteIp, remotePort));
		if (!clientChannel.connect(new InetSocketAddress(remoteIp, remotePort))){  
            //不断地轮询连接状态0 
            while (!clientChannel.finishConnect()){  
                //在等待连接的时间里，可以执行其他任务，以充分发挥非阻塞IO的异步特性  
                //这里为了演示该方法的使用，只是一直打印"."  
                System.out.print(".");    
            }
        }
		return 0;
	}

	
	@Override
	public int SendData(byte[] datas, int datalen) throws IOException {
		// TODO Auto-generated method stub
		ByteBuffer tmpBuffer = ByteBuffer.wrap(datas,0,datalen);
		//clientChannel.write(tmpBuffer, 0, datalen);
		clientChannel.write(tmpBuffer);
		return 0;
	}

	@Override
	public int ReleaseResource() throws IOException {
		// TODO Auto-generated method stub
		
		if (clientChannel == null) {
			return 0;
		}
		
		if ( null != selectionKey){
			selectionKey.cancel();
		}
		if ( clientChannel.isConnected()) {
			clientChannel.finishConnect();
		}
		clientChannel.close();
		clientChannel = null;
		return 0;
	}

	@Override
	public int ReadData(byte[] datas) throws IOException {
		// TODO Auto-generated method stub
		//clientChannel.read(dsts, offset, length)
		recvBuffer = ByteBuffer.wrap(datas);
		int result = clientChannel.read(recvBuffer);
		return result;
	}
	
	
	protected void finalize() throws Throwable {
		ReleaseResource();
	}
	
}
