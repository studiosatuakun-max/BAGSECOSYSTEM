package com.rfid.test;

import static org.junit.Assert.*;

import java.io.IOException;

import org.junit.Test;

import com.rfid.AppNotifyImpl.MRfidReaderNotifyImpl;
import com.rfid.transport.RfidReaderManager;

public class TcpServerTest {

	@Test
	public void test() throws IOException {
		System.out.println("the program will start as being tcp server.");
		MRfidReaderNotifyImpl appNotify = new MRfidReaderNotifyImpl();
		RfidReaderManager.initilizeTransportManager(appNotify);
		try {
			RfidReaderManager.getInstance().CreateTcpServer(9000);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			//e.printStackTrace();
			System.out.println("the port main be used" );
		}
		while(true){
			try {
				Thread.sleep(3000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

}
