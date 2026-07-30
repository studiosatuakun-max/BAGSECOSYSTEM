/**
 * 
 */
package com.rfid.transport;

import java.io.IOException;
import java.net.SocketAddress;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;

import com.rfid.reader.AppNotify;
import com.rfid.reader.MRfidReader;
import com.rfid.reader.RfidReader;

/**
 * @author hrb
 * 
 */
public final class RfidReaderManager {
	private static RfidReaderManager manager = null;
	private static Thread readThread = null;
	private Selector selector = null;
	private HashMap<String, RfidReader> readerMap; // support non-net interface
	public HashMap<String,RfidReader> serverMap;
	public TransportTcpServer server;
	private AppNotify appNotify;
	
	private RfidReaderManager() throws IOException {
		appNotify = null;
		selector = Selector.open();
		readerMap = new HashMap<String, RfidReader>();
	}

	public static RfidReaderManager getInstance() throws IOException {
		return manager;
	}

	public static void initilizeTransportManager(AppNotify appNotify) throws IOException {
		// create one thread for receive data.
		if (null == manager) {
			synchronized (RfidReaderManager.class) {
				if (manager == null) {
					manager = new RfidReaderManager();
					manager.appNotify = appNotify;
				}
			}
		}
		initilizeThreads();
	}

	public Iterator<Entry<String, RfidReader>> getReaderIterator() {
		return readerMap.entrySet().iterator();
	}

	public Selector getSelector() {
		return this.selector;
	}

	public static void initilizeThreads() {
		if (null == readThread) {
			readThread = new ReceiveThread();
			readThread.start();
		}
	}

	public RfidReader CreateSerialPort(String portName, int baudRate) throws Exception {
		int result = -1;
		MRfidReader reader = null;
		TransportSerialPort serialPort = new TransportSerialPort();
		serialPort.SetSerialPortConfig(portName.trim(), baudRate);
		result = serialPort.RequestLocalResource();
		if (0 == result) {
			reader = new MRfidReader();
			reader.setAppNotify(appNotify);
			reader.setKey(portName.trim());
			reader.setTransport(serialPort);
			readerMap.put(reader.getKey(), reader);
		}
		return reader;
	}
	
	public RfidReader CreateTcpclient(String readerIp,int readerPort,String localHostIp,int localHostPort) throws IOException{
		int result = -1;
		MRfidReader reader = null;
		TransportTcpClient tcpTransport = new TransportTcpClient();
		tcpTransport.SetConfig(readerIp, readerPort, localHostIp, localHostPort);
		result = tcpTransport.RequestLocalResource();
		String key = "TCP:"+ localHostIp.trim() + ":" + localHostPort;
		if (result == 0) {
			reader = new MRfidReader();
			reader.setAppNotify(appNotify);
			reader.setKey(key);
			reader.setTransport(tcpTransport);
			tcpTransport.clientChannel.configureBlocking(false);
			tcpTransport.clientChannel.register(selector, SelectionKey.OP_READ,
					reader);
			readerMap.put(reader.getKey(), reader);
		}
		return reader;
	}
	
	public RfidReader CreateUdpConnection(String readerIp,int readerPort,String localHostIp,int localHostPort) throws IOException{
		int result = -1;
		MRfidReader reader = null;
		TransportUdp udpTransport = new TransportUdp();
		udpTransport.SetConfig(readerIp, readerPort, localHostIp, localHostPort);
		result = udpTransport.RequestLocalResource();
		String key = "UDP:"+ localHostIp.trim() + ":" + localHostPort;
		if ( result == 0) {
			reader = new MRfidReader();
			reader.setAppNotify(appNotify);
			reader.setKey(key);
			reader.setTransport(udpTransport);
			udpTransport.socketChannel.configureBlocking(false);
			udpTransport.socketChannel.register(selector, SelectionKey.OP_READ,
					reader);
			readerMap.put(reader.getKey(), reader);
		}
		return reader;
	}
	
	public boolean CreateTcpServer(int listenPort) throws Exception
	{
		int result = -1;
		boolean createResult = false;
		server = new TransportTcpServer();
		server.setConfig(listenPort);
		result = server.RequestLocalResource();
		if (0 == result){
			serverMap = new HashMap<String,RfidReader>();
			serverMap.clear();
			String key = "TCP:" + listenPort;
			server.serverChannel.register(selector, SelectionKey.OP_ACCEPT);
		}
		return createResult;
	}
	
	public void OnNewReaderConnect(TransportTcpClient client){
		MRfidReader reader = new MRfidReader();
		reader.setAppNotify(appNotify);
		reader.setTransport(client);
		appNotify.NotifyNewTcpConnectAvailable(reader);
	}
	
	public void AcceptNewReaderConnect(RfidReader reader){
		RfidReader checkReader = null;
		if (null == serverMap){
			return;
		}
		TransportTcpClient tcpTransport = (TransportTcpClient) reader.getTransport();
		try {
			SocketAddress address = tcpTransport.clientChannel.socket().getRemoteSocketAddress();
			String key = address.toString();
			reader.setKey(key);
			checkReader = serverMap.get(key);
			if (null != checkReader){
				serverMap.remove(key);
			}
			tcpTransport.clientChannel.configureBlocking(false);
			tcpTransport.selectionKey = tcpTransport.clientChannel.register(selector, SelectionKey.OP_READ,reader);
			serverMap.put(key,reader);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void ReleaseReader(RfidReader reader){
		try {
			reader.getTransport().ReleaseResource();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void OnTcpRemoteDisconnect(RfidReader reader){
		TransportTcpClient tcpTransport = (TransportTcpClient) reader.getTransport();
		tcpTransport.selectionKey.cancel();
		serverMap.remove(reader.getKey());
		readerMap.remove(reader.getKey());
		appNotify.NotifyRemoteCloseConnection(reader);
		
	}
}
