package com.rfid.reader;

//接收到响应后通知上层处理的接口
public interface AppNotify {
	public int NotifyRecvOneTag(RfidReader reader,String epcData,String tidData);	//上报读取到标签数据

	public void NotifyNewTcpConnectAvailable(RfidReader reader);
	public void NotifyRemoteCloseConnection(RfidReader reader);
	
	public void NotifyRebootRsp(RfidReader reader, int status);	//上报重启结果，设备重启后会自动读标签
	public void NotifySetDefaultParamRsp(RfidReader reader, int status);	//上报重启结果，设备重启后会自动读标签
	public void NotifyStartInventoryRsp(RfidReader reader, int status);	//上报开始盘寻的结果
	public void NotifyStopInventoryRsp(RfidReader reader, int status);
	//public void NotifySetWorkParamRsp(RfidReader reader, int status);	//上报设置工作参数
	public void NotifyWriteTagRsp(RfidReader reader, int status);
	public void NotifyReadTagRsp(RfidReader reader,int status,byte[] readTagData);
}
