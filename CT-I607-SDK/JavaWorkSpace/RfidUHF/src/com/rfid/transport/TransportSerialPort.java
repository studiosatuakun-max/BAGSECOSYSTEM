package com.rfid.transport;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Enumeration;

import gnu.io.CommPort;
import gnu.io.CommPortIdentifier;
import gnu.io.NoSuchPortException;
import gnu.io.PortInUseException;
import gnu.io.SerialPort;
import gnu.io.UnsupportedCommOperationException;

public class TransportSerialPort extends Transport {

	private String serialPortName;
	private int baudRate;
	public SerialPort serialPortChannel;
	
	public TransportSerialPort()
	{
		this.connectType = CONNECT_TYPE_SERIALPORT;
	}
	@SuppressWarnings("unchecked")
	public static final ArrayList<String> findPort() {
        // 获得当前所有可用串口
		Enumeration<CommPortIdentifier> portList = CommPortIdentifier.getPortIdentifiers();
        ArrayList<String> portNameList = new ArrayList<String>();
        // 将可用串口名添加到List并返回该List
        while (portList.hasMoreElements()) {
            String portName = portList.nextElement().getName();
            portNameList.add(portName);
        }
        return portNameList;
    }

	public void SetSerialPortConfig(String portName,int baudRate) {
		this.serialPortName = portName;
		this.baudRate = baudRate;
	}

	public String getSerialPortName() {
		return serialPortName;
	}

	public void setSerialPortName(String serialPortName) {
		this.serialPortName = serialPortName;
	}

	public int getBaudRate() {
		return baudRate;
	}

	public void setBaudRate(int baudRate) {
		this.baudRate = baudRate;
	}

	public int OpenSerialPort() {
		return 0;
	}
	
	public int CloseSerialPort() {
		return 0;
	}

	@Override
	public int RequestLocalResource() throws Exception{
		// TODO Auto-generated method stub
		if (serialPortChannel != null) {
			ReleaseResource();
        }
		try {

            //通过端口名识别端口
            CommPortIdentifier portIdentifier = CommPortIdentifier.getPortIdentifier(serialPortName);

            //打开端口，并给端口名字和一个timeout（打开操作的超时时间）
            CommPort commPort = portIdentifier.open(serialPortName, 500);

            //判断是不是串口
            if (commPort instanceof SerialPort) {
                
            	serialPortChannel = (SerialPort) commPort;
                
                try {                        
                    //设置一下串口的波特率等参数
                	serialPortChannel.setSerialPortParams(baudRate, SerialPort.DATABITS_8, SerialPort.STOPBITS_1, SerialPort.PARITY_NONE);                              
                } catch (UnsupportedCommOperationException e) {  
                    throw new UnsupportedCommOperationException("open serial port error");
                }
            }        
            else {
                //不是串口
                throw new Exception("it is not a serail port");
            }
        } catch (NoSuchPortException e1) {
          throw new NoSuchPortException();
        } catch (PortInUseException e2) {
            throw new PortInUseException();
        }
		return 0;
	}

	@Override
	public int ReleaseResource() throws IOException {
		// TODO Auto-generated method stub
		if (serialPortChannel != null) {
			serialPortChannel.close();
			serialPortChannel = null;
        }
		return 0;
	}

	@Override
	public int SendData(byte[] datas, int datalen) throws IOException {
		// TODO Auto-generated method stub
		OutputStream out = null;
        try { 
            out = serialPortChannel.getOutputStream();
            out.write(datas,0,datalen);
            out.flush();
        } catch (IOException e) {
            throw new IOException("Send data through serial port fail");
        } finally {
            try {
                if (out != null) {
                    out.close();
                    out = null;
                }                
            } catch (IOException e) {
                throw new IOException("send data fail,maybe the serial port is close");
            }
        }
		return 0;
	}

	@Override
	public int ReadData(byte[] datas) throws IOException {
		// TODO Auto-generated method stub
		InputStream in = null;
		int startIndex = 0;
		int readLen = 0;
		int readBuffLen = datas.length;
        //byte[] bytes = null;

        try {
            
            in = serialPortChannel.getInputStream();
            //int bufflenth = in.available();        //获取buffer里的数据长度
            //if (datas.length >= in.available()) {
            //	bytes = datas;
            //}
            /*
            while (bufflenth != 0) {                             
            	readLen = in.read(datas,startIndex, readBuffLen);
            	
            	startIndex = startIndex + readLen;
            	readBuffLen = readBuffLen - readLen;
                bufflenth = in.available();
            } 
            */
            readLen = in.read(datas);
            if (readLen == -1) {
            	System.out.println("recv error");
            }
        } catch (IOException e) {
            throw new IOException("Read data from serial port fail");
        } finally {
            try {
                if (in != null) {
                    in.close();
                    in = null;
                }
            } catch(IOException e) {
                throw new IOException("close serial port input stream fail.");
            }

        }
		return readLen;
	}
	
	@Override
	protected void finalize() throws Throwable {
		// TODO Auto-generated method stub
		
	}
}
