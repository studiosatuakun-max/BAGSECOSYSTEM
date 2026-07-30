using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

namespace RfidSdk
{
    public enum TransportType
    {
        SerialPort,
        UDP,
        TcpClient,
        TcpServerClient
    }
    public class Transport
    {
        private String serialPortName;
        private int baudRate;

        //net
        private String localIP;
        private UInt16 localPort;
        private String remoteIP;
        private UInt16 remotPort;
        TransportType transportType;
        RfidSerialPort serialPort;
        RfidReader notifyReader;
        RfidNet readerSocket;
        IPEndPoint localEnpoint;

        public IPEndPoint remoteEnpoint;
        public Transport(RfidReader notifyReader)
        {
            this.notifyReader = notifyReader;
        }

        public void SetSerialPortParam(String serialPortName, int baudRate)
        {
            this.serialPortName = serialPortName;
            this.baudRate = baudRate;
            transportType = TransportType.SerialPort;
        }

        public void SetIPParam(String localIP,UInt16 localPort,String remoteIP,UInt16 remotePort,TransportType type)
        {
            this.localIP = localIP;
            this.localPort = localPort;
            this.remoteIP = remoteIP;
            this.remotPort = remotePort;
            transportType = type;
            if (!remoteIP.Equals("255.255.255.255"))
            {
                remoteEnpoint = new IPEndPoint(IPAddress.Parse(remoteIP), remotePort);
            }
            else
            {
                remoteEnpoint = new IPEndPoint(IPAddress.Broadcast, remotePort);
            }
            localEnpoint = new IPEndPoint(IPAddress.Parse(localIP), localPort);

        }


        private delegate string ConnectSocketDelegate(IPEndPoint ipep, Socket sock);
        private string ConnectSocket(IPEndPoint ipep, Socket sock)
        {
            string exmessage = "";
            try
            {
                sock.Connect(ipep);
            }
            catch (System.Exception ex)
            {
                exmessage = ex.Message;
            }
            finally
            {
            }

            return exmessage;
        }
        public Boolean RequestResource()
        {
            if (transportType == TransportType.SerialPort)
            {
                if (null != serialPort && serialPort.IsOpen)
                {
                    serialPort.Close();
                    serialPort = null;
                }
                serialPort = new RfidSerialPort(this.serialPortName, this.baudRate,notifyReader);
                try
                {
                    serialPort.Open();
                }
                catch(Exception)
                {
                    return false;
                }
                return serialPort.IsOpen;
                
            }
            else if (transportType == TransportType.UDP)
            {
                try
                {
                    readerSocket = new RfidNet(notifyReader, AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
                    readerSocket.Bind(localEnpoint);
                    readerSocket.SendBufferSize = 512;
                    readerSocket.ReceiveBufferSize = 1024;
                    if (remoteIP.Equals("255.255.255.255"))
                    {
                        readerSocket.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.Broadcast, 1);
                    }
                }
                catch(Exception)
                {
                    return false;
                }
                return true;
            }
            else if (transportType == TransportType.TcpClient)
            {
                try
                {
                    readerSocket = new RfidNet(notifyReader, AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
                    readerSocket.Bind(localEnpoint);
                    ConnectSocketDelegate connect = ConnectSocket;
                    IAsyncResult asyncResult = connect.BeginInvoke(remoteEnpoint, readerSocket, null, null);
                    bool connectSuccess = asyncResult.AsyncWaitHandle.WaitOne(1000, false);
                    if (!connectSuccess)
                    {
                        return false;
                    }
                    string exmessage = connect.EndInvoke(asyncResult);
                    if (!string.IsNullOrEmpty(exmessage))
                    {
                        return false;
                    }
                }
                catch(Exception)
                {
                    return false;
                }
                return true;
            }
            return false;
        }

        public void ReleaseResource()
        {
            if (null != serialPort)
            {
                serialPort.Close();
                serialPort = null;
            }
            if (null != readerSocket)
            {
                if (readerSocket.Connected)
                {
                    readerSocket.Shutdown(SocketShutdown.Both);
                    if (transportType == TransportType.TcpClient)
                    {
                        readerSocket.Disconnect(false);
                    }
                } 
                readerSocket.Close();
                readerSocket = null;
            }
        }

        public void SendData(byte[] sendBuffer,int offset,int sendLen)
        {
            if ( TransportType.SerialPort == transportType)
            {
                serialPort.Write(sendBuffer, offset, sendLen);
            }
            if (null != readerSocket)
            {
                if (TransportType.UDP == transportType)
                {
                    readerSocket.SendTo(sendBuffer, offset, sendLen, SocketFlags.None, remoteEnpoint);
                }
                else if (TransportType.TcpClient == transportType)
                {
                    readerSocket.Send(sendBuffer, offset, sendLen, SocketFlags.None);
                }
            }
        }

        public void HandleRecvData()
        {
            if (TransportType.SerialPort == transportType)
            {
                if ( (null == serialPort) || (true != serialPort.IsOpen))
                {
                    return;
                }
                serialPort.HandleRecv();
            }
            else if (TransportType.UDP == transportType || TransportType.TcpClient == transportType)
            {
                readerSocket.HandleRecv();
            }

        }
    }
}
