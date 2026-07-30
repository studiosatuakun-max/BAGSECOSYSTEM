package com.rfid.test;
import static org.junit.Assert.*;
import java.io.IOException;
import org.junit.Test;
import com.rfid.AppNotifyImpl.MRfidReaderNotifyImpl;
import com.rfid.reader.MRfidReader;
import com.rfid.reader.RfidReader;
import com.rfid.transport.RfidReaderManager;

public class SerialPortTest {

	@Test
	public void test() throws Exception{
		System.out.println("Start Serial Port Test....");
		MRfidReaderNotifyImpl appNotify = new MRfidReaderNotifyImpl();
		RfidReaderManager.initilizeTransportManager(appNotify);
		//打开COM2串口,波特率115200
		RfidReader reader = RfidReaderManager.getInstance().CreateSerialPort("COM4",115200);
		System.out.println("the application start recveive data from reader.");
		//如果让设备自动读卡就设置为true,其余功能测试则为false
		boolean isInventoryTest = false;
		if (isInventoryTest){
			//设备重启,也作为开始读卡用
			reader.Inventory();
			while(true) {
				//主线程休眠，appNotify会被RfidReaderManager调用返回标签数据
				Thread.sleep(3000);
			}
		}
		else {
			//做如下功能的时候最好不要让设备读标签
			//reader.Stop();
			while(true) {
				Thread.sleep(3000);
				
				//停止读卡功能测试
				//reader.Stop();
				
				
				/*
				//写标签数据
				byte[] writtenData = new byte[4];
				for (int iIndex = 0;iIndex < 4;iIndex++) {
					writtenData[iIndex] = (byte)iIndex;
				}
				reader.WriteTagBlock((byte)GeneralReader.RFID_TAG_MEMBANK_USER, (byte)0, (byte)2, writtenData, 0);
				*/
				
				/*
				//读取用户区中起始地址为0，长度为2个字的数据
				//reader.ReadTagBlock((byte)GeneralReader.RFID_TAG_MEMBANK_USER, (byte)0, (byte)2);
				 * */
				
				//锁定EPC
				//reader.LockTag(GeneralReader.RFID_LOCK_EPC);
				
				//销毁标签
				//reader.KillTag();
				
				//通过主动发命令的方式盘寻一次标签
				//reader.InventoryOnce();
			}
		}
	}

}
