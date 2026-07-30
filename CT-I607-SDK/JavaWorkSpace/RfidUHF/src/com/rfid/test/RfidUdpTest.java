package com.rfid.test;
import static org.junit.Assert.*;

import java.io.IOException;

import org.junit.Test;
import com.rfid.AppNotifyImpl.MRfidReaderNotifyImpl;
import com.rfid.reader.MRfidReader;
import com.rfid.reader.RfidReader;
import com.rfid.transport.RfidReaderManager;

class RfidUdpTest {
	@Test
	void test() throws Exception {
		System.out.println("this sample is for R2000 with UDP.");
		//创建处理读写器响应的处理对象
		MRfidReaderNotifyImpl appNotify = new MRfidReaderNotifyImpl();
		
		//初始化rfid管理模块
		RfidReaderManager.initilizeTransportManager(appNotify);
		
		//设置发送的目的地址是读写器的IP(192.168.1.65 12345)和地址,本地打开的UDP端口为12345
		RfidReader reader = RfidReaderManager.getInstance().CreateUdpConnection("192.168.1.150", 9000, "127.0.0.1",12345);
		
		if (null != reader){
			System.out.println("connet to the reader is ok.");
		}
		else{
			return;
		}

		//如果让设备自动读卡就设置为true,其余功能测试则为false
		boolean isInventoryTest = true;
		if (isInventoryTest){
			//发送盘寻命令使设备开始持续读标签。Reboot命令也有同样的功能
			reader.Inventory();
			while(true) {
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
