package com.rfid.transport;

import java.io.IOException;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.SocketChannel;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;

import com.rfid.reader.RfidReader;

public class ReceiveThread extends Thread {
	private SocketChannel clientChannel;
	@Override
	public void run() {
		RfidReaderManager manager;
		try {
			manager = RfidReaderManager.getInstance();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return;
		}
		Set<SelectionKey> keySet = null;
		Iterator<SelectionKey> keyIter = null;
		Iterator<Entry<String,RfidReader>> readersItor = null;
		SelectionKey selectkey = null;
		int selectResult = 0;
		Selector selector = manager.getSelector();
		RfidReader reader = null;
		while(true) {
			if ( null != selector) {
				try {
					selectResult = selector.selectNow();
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
				if (0 != selectResult) {
					keySet = manager.getSelector().selectedKeys();
					keyIter = keySet.iterator();
					while(keyIter.hasNext()) {
						selectkey = (SelectionKey)keyIter.next();
						if (selectkey.isReadable())
						{
							reader = (RfidReader)selectkey.attachment();
							//接收数据并进行处理
							try {
								reader.HandleRecv();
							} catch (IOException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
							//为下次接收准备
							//selectkey.interestOps(SelectionKey.OP_READ);
							keyIter.remove();
						}
						else if(selectkey.isAcceptable())
						{
							//处理作为Server端时
						}
					}
				}
				
				try {
					if ( (null != manager.server) && (null != manager.server.serverChannel)){
						clientChannel = manager.server.serverChannel.accept();
						if (null != clientChannel){
							// a new reader connect
							TransportTcpClient client = new TransportTcpClient();
							client.clientChannel = clientChannel;
							manager.OnNewReaderConnect(client);
						}
						
					}
				} catch (IOException e1) {
					// TODO Auto-generated catch block
					//e1.printStackTrace();
					clientChannel = null;
				}
			}
			
			
			//处理串口数据
			
			readersItor = manager.getReaderIterator();
			while(readersItor.hasNext()) {
				reader = ((Map.Entry<String, RfidReader>)readersItor.next()).getValue();
				//如果是串口
				if ( reader.getTransport().connectType == reader.getTransport().CONNECT_TYPE_SERIALPORT) {
					//检测是否有数据
					TransportSerialPort port = (TransportSerialPort)reader.getTransport();
					try {
						if ( 0 != port.serialPortChannel.getInputStream().available()) {
							try {
								Thread.sleep(50);
							} catch (InterruptedException e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
							reader.HandleRecv();
						}
					} catch (IOException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			}
			
		}
	}
}
