namespace RfidReader
{
    partial class Form1
    {
        /// <summary>
        /// 必需的设计器变量。
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 清理所有正在使用的资源。
        /// </summary>
        /// <param name="disposing">如果应释放托管资源，为 true；否则为 false。</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows 窗体设计器生成的代码

        /// <summary>
        /// 设计器支持所需的方法 - 不要修改
        /// 使用代码编辑器修改此方法的内容。
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Form1));
            this.skinComboBox_serial_port = new CCWin.SkinControl.SkinComboBox();
            this.skinLabel_serialport_num = new CCWin.SkinControl.SkinLabel();
            this.skinButton_fresh = new CCWin.SkinControl.SkinButton();
            this.listView_result = new CCWin.SkinControl.SkinListView();
            this.columnHeader_time = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader_text = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.skinPanel_serialport = new CCWin.SkinControl.SkinPanel();
            this.skinComboBox_baudrate = new CCWin.SkinControl.SkinComboBox();
            this.skinLabel3 = new CCWin.SkinControl.SkinLabel();
            this.skinPanel_connection = new CCWin.SkinControl.SkinPanel();
            this.skinPanel_network = new CCWin.SkinControl.SkinPanel();
            this.skinWaterTextBox_local_port = new CCWin.SkinControl.SkinWaterTextBox();
            this.skinLabel2 = new CCWin.SkinControl.SkinLabel();
            this.skinButton_tcp_server = new CCWin.SkinControl.SkinButton();
            this.skinComboBox_net_protocol = new CCWin.SkinControl.SkinComboBox();
            this.skinLabel1 = new CCWin.SkinControl.SkinLabel();
            this.skinButton_net_scan = new CCWin.SkinControl.SkinButton();
            this.skinWaterTextBox_remote_port = new CCWin.SkinControl.SkinWaterTextBox();
            this.skinWaterTextBox_remote_ip = new CCWin.SkinControl.SkinWaterTextBox();
            this.skinLabel_port = new CCWin.SkinControl.SkinLabel();
            this.skinLabel_ip = new CCWin.SkinControl.SkinLabel();
            this.skinComboBox_interface = new CCWin.SkinControl.SkinComboBox();
            this.skinLabel_interface = new CCWin.SkinControl.SkinLabel();
            this.skinButton_connect = new CCWin.SkinControl.SkinButton();
            this.skinPictureBox_welcom = new CCWin.SkinControl.SkinPictureBox();
            this.skinPanel_serialport.SuspendLayout();
            this.skinPanel_connection.SuspendLayout();
            this.skinPanel_network.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.skinPictureBox_welcom)).BeginInit();
            this.SuspendLayout();
            // 
            // skinComboBox_serial_port
            // 
            this.skinComboBox_serial_port.DrawMode = System.Windows.Forms.DrawMode.OwnerDrawFixed;
            this.skinComboBox_serial_port.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.skinComboBox_serial_port.FormattingEnabled = true;
            this.skinComboBox_serial_port.Location = new System.Drawing.Point(124, 21);
            this.skinComboBox_serial_port.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.skinComboBox_serial_port.Name = "skinComboBox_serial_port";
            this.skinComboBox_serial_port.Size = new System.Drawing.Size(140, 29);
            this.skinComboBox_serial_port.TabIndex = 0;
            this.skinComboBox_serial_port.WaterText = "";
            // 
            // skinLabel_serialport_num
            // 
            this.skinLabel_serialport_num.AutoSize = true;
            this.skinLabel_serialport_num.BackColor = System.Drawing.Color.Transparent;
            this.skinLabel_serialport_num.BorderColor = System.Drawing.Color.White;
            this.skinLabel_serialport_num.Font = new System.Drawing.Font("微软雅黑", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.skinLabel_serialport_num.Location = new System.Drawing.Point(15, 21);
            this.skinLabel_serialport_num.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.skinLabel_serialport_num.Name = "skinLabel_serialport_num";
            this.skinLabel_serialport_num.Size = new System.Drawing.Size(97, 24);
            this.skinLabel_serialport_num.TabIndex = 1;
            this.skinLabel_serialport_num.Text = "SerialPort:";
            // 
            // skinButton_fresh
            // 
            this.skinButton_fresh.BackColor = System.Drawing.Color.Transparent;
            this.skinButton_fresh.ControlState = CCWin.SkinClass.ControlState.Normal;
            this.skinButton_fresh.DownBack = null;
            this.skinButton_fresh.Location = new System.Drawing.Point(80, 135);
            this.skinButton_fresh.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.skinButton_fresh.MouseBack = null;
            this.skinButton_fresh.Name = "skinButton_fresh";
            this.skinButton_fresh.NormlBack = null;
            this.skinButton_fresh.Size = new System.Drawing.Size(112, 34);
            this.skinButton_fresh.TabIndex = 5;
            this.skinButton_fresh.Text = "Fresh";
            this.skinButton_fresh.UseVisualStyleBackColor = false;
            this.skinButton_fresh.Click += new System.EventHandler(this.skinButton_fresh_Click);
            // 
            // listView_result
            // 
            this.listView_result.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.columnHeader_time,
            this.columnHeader_text});
            this.listView_result.FullRowSelect = true;
            this.listView_result.Location = new System.Drawing.Point(18, 630);
            this.listView_result.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.listView_result.Name = "listView_result";
            this.listView_result.OwnerDraw = true;
            this.listView_result.RowBackColor2 = System.Drawing.Color.FromArgb(((int)(((byte)(235)))), ((int)(((byte)(254)))), ((int)(((byte)(237)))));
            this.listView_result.Size = new System.Drawing.Size(1177, 205);
            this.listView_result.TabIndex = 11;
            this.listView_result.UseCompatibleStateImageBehavior = false;
            this.listView_result.View = System.Windows.Forms.View.Details;
            // 
            // columnHeader_time
            // 
            this.columnHeader_time.Text = "Time";
            this.columnHeader_time.Width = 81;
            // 
            // columnHeader_text
            // 
            this.columnHeader_text.Text = "Conten";
            this.columnHeader_text.Width = 701;
            // 
            // skinPanel_serialport
            // 
            this.skinPanel_serialport.BackColor = System.Drawing.Color.Transparent;
            this.skinPanel_serialport.Controls.Add(this.skinComboBox_baudrate);
            this.skinPanel_serialport.Controls.Add(this.skinLabel3);
            this.skinPanel_serialport.Controls.Add(this.skinLabel_serialport_num);
            this.skinPanel_serialport.Controls.Add(this.skinComboBox_serial_port);
            this.skinPanel_serialport.Controls.Add(this.skinButton_fresh);
            this.skinPanel_serialport.ControlState = CCWin.SkinClass.ControlState.Normal;
            this.skinPanel_serialport.DownBack = null;
            this.skinPanel_serialport.Location = new System.Drawing.Point(0, 48);
            this.skinPanel_serialport.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.skinPanel_serialport.MouseBack = null;
            this.skinPanel_serialport.Name = "skinPanel_serialport";
            this.skinPanel_serialport.NormlBack = null;
            this.skinPanel_serialport.Size = new System.Drawing.Size(280, 200);
            this.skinPanel_serialport.TabIndex = 12;
            // 
            // skinComboBox_baudrate
            // 
            this.skinComboBox_baudrate.DrawMode = System.Windows.Forms.DrawMode.OwnerDrawFixed;
            this.skinComboBox_baudrate.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.skinComboBox_baudrate.FormattingEnabled = true;
            this.skinComboBox_baudrate.Items.AddRange(new object[] {
            "9600",
            "19200",
            "38400",
            "57600",
            "115200"});
            this.skinComboBox_baudrate.Location = new System.Drawing.Point(124, 72);
            this.skinComboBox_baudrate.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.skinComboBox_baudrate.Name = "skinComboBox_baudrate";
            this.skinComboBox_baudrate.Size = new System.Drawing.Size(140, 29);
            this.skinComboBox_baudrate.TabIndex = 7;
            this.skinComboBox_baudrate.WaterText = "";
            // 
            // skinLabel3
            // 
            this.skinLabel3.AutoSize = true;
            this.skinLabel3.BackColor = System.Drawing.Color.Transparent;
            this.skinLabel3.BorderColor = System.Drawing.Color.White;
            this.skinLabel3.Font = new System.Drawing.Font("微软雅黑", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.skinLabel3.Location = new System.Drawing.Point(14, 75);
            this.skinLabel3.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.skinLabel3.Name = "skinLabel3";
            this.skinLabel3.Size = new System.Drawing.Size(102, 24);
            this.skinLabel3.TabIndex = 6;
            this.skinLabel3.Text = "Baud Rate:";
            // 
            // skinPanel_connection
            // 
            this.skinPanel_connection.BackColor = System.Drawing.Color.Transparent;
            this.skinPanel_connection.BorderColor = System.Drawing.Color.DarkCyan;
            this.skinPanel_connection.Controls.Add(this.skinPanel_network);
            this.skinPanel_connection.Controls.Add(this.skinComboBox_interface);
            this.skinPanel_connection.Controls.Add(this.skinLabel_interface);
            this.skinPanel_connection.Controls.Add(this.skinButton_connect);
            this.skinPanel_connection.Controls.Add(this.skinPanel_serialport);
            this.skinPanel_connection.ControlState = CCWin.SkinClass.ControlState.Normal;
            this.skinPanel_connection.DownBack = null;
            this.skinPanel_connection.Location = new System.Drawing.Point(18, 24);
            this.skinPanel_connection.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.skinPanel_connection.MouseBack = null;
            this.skinPanel_connection.Name = "skinPanel_connection";
            this.skinPanel_connection.NormlBack = null;
            this.skinPanel_connection.Size = new System.Drawing.Size(291, 330);
            this.skinPanel_connection.TabIndex = 14;
            // 
            // skinPanel_network
            // 
            this.skinPanel_network.BackColor = System.Drawing.Color.Transparent;
            this.skinPanel_network.Controls.Add(this.skinWaterTextBox_local_port);
            this.skinPanel_network.Controls.Add(this.skinLabel2);
            this.skinPanel_network.Controls.Add(this.skinButton_tcp_server);
            this.skinPanel_network.Controls.Add(this.skinComboBox_net_protocol);
            this.skinPanel_network.Controls.Add(this.skinLabel1);
            this.skinPanel_network.Controls.Add(this.skinButton_net_scan);
            this.skinPanel_network.Controls.Add(this.skinWaterTextBox_remote_port);
            this.skinPanel_network.Controls.Add(this.skinWaterTextBox_remote_ip);
            this.skinPanel_network.Controls.Add(this.skinLabel_port);
            this.skinPanel_network.Controls.Add(this.skinLabel_ip);
            this.skinPanel_network.ControlState = CCWin.SkinClass.ControlState.Normal;
            this.skinPanel_network.DownBack = null;
            this.skinPanel_network.Location = new System.Drawing.Point(4, 42);
            this.skinPanel_network.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.skinPanel_network.MouseBack = null;
            this.skinPanel_network.Name = "skinPanel_network";
            this.skinPanel_network.NormlBack = null;
            this.skinPanel_network.Size = new System.Drawing.Size(279, 232);
            this.skinPanel_network.TabIndex = 15;
            // 
            // skinWaterTextBox_local_port
            // 
            this.skinWaterTextBox_local_port.Location = new System.Drawing.Point(138, 102);
            this.skinWaterTextBox_local_port.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.skinWaterTextBox_local_port.Name = "skinWaterTextBox_local_port";
            this.skinWaterTextBox_local_port.Size = new System.Drawing.Size(122, 28);
            this.skinWaterTextBox_local_port.TabIndex = 9;
            this.skinWaterTextBox_local_port.WaterColor = System.Drawing.Color.FromArgb(((int)(((byte)(127)))), ((int)(((byte)(127)))), ((int)(((byte)(127)))));
            this.skinWaterTextBox_local_port.WaterText = "";
            // 
            // skinLabel2
            // 
            this.skinLabel2.AutoSize = true;
            this.skinLabel2.BackColor = System.Drawing.Color.Transparent;
            this.skinLabel2.BorderColor = System.Drawing.Color.White;
            this.skinLabel2.Font = new System.Drawing.Font("微软雅黑", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.skinLabel2.Location = new System.Drawing.Point(21, 105);
            this.skinLabel2.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.skinLabel2.Name = "skinLabel2";
            this.skinLabel2.Size = new System.Drawing.Size(99, 24);
            this.skinLabel2.TabIndex = 8;
            this.skinLabel2.Text = "Local Port:";
            // 
            // skinButton_tcp_server
            // 
            this.skinButton_tcp_server.BackColor = System.Drawing.Color.Transparent;
            this.skinButton_tcp_server.ControlState = CCWin.SkinClass.ControlState.Normal;
            this.skinButton_tcp_server.DownBack = null;
            this.skinButton_tcp_server.Location = new System.Drawing.Point(147, 194);
            this.skinButton_tcp_server.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.skinButton_tcp_server.MouseBack = null;
            this.skinButton_tcp_server.Name = "skinButton_tcp_server";
            this.skinButton_tcp_server.NormlBack = null;
            this.skinButton_tcp_server.Size = new System.Drawing.Size(112, 34);
            this.skinButton_tcp_server.TabIndex = 7;
            this.skinButton_tcp_server.Text = "TCP Server";
            this.skinButton_tcp_server.UseVisualStyleBackColor = false;
            this.skinButton_tcp_server.Click += new System.EventHandler(this.skinButton_tcp_server_Click);
            // 
            // skinComboBox_net_protocol
            // 
            this.skinComboBox_net_protocol.DrawMode = System.Windows.Forms.DrawMode.OwnerDrawFixed;
            this.skinComboBox_net_protocol.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.skinComboBox_net_protocol.FormattingEnabled = true;
            this.skinComboBox_net_protocol.Items.AddRange(new object[] {
            "UDP",
            "TCP Client"});
            this.skinComboBox_net_protocol.Location = new System.Drawing.Point(117, 142);
            this.skinComboBox_net_protocol.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.skinComboBox_net_protocol.Name = "skinComboBox_net_protocol";
            this.skinComboBox_net_protocol.Size = new System.Drawing.Size(146, 29);
            this.skinComboBox_net_protocol.TabIndex = 6;
            this.skinComboBox_net_protocol.WaterText = "";
            // 
            // skinLabel1
            // 
            this.skinLabel1.AutoSize = true;
            this.skinLabel1.BackColor = System.Drawing.Color.Transparent;
            this.skinLabel1.BorderColor = System.Drawing.Color.White;
            this.skinLabel1.Font = new System.Drawing.Font("微软雅黑", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.skinLabel1.Location = new System.Drawing.Point(12, 147);
            this.skinLabel1.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.skinLabel1.Name = "skinLabel1";
            this.skinLabel1.Size = new System.Drawing.Size(86, 24);
            this.skinLabel1.TabIndex = 5;
            this.skinLabel1.Text = "Protocol:";
            // 
            // skinButton_net_scan
            // 
            this.skinButton_net_scan.BackColor = System.Drawing.Color.Transparent;
            this.skinButton_net_scan.ControlState = CCWin.SkinClass.ControlState.Normal;
            this.skinButton_net_scan.DownBack = null;
            this.skinButton_net_scan.Location = new System.Drawing.Point(18, 194);
            this.skinButton_net_scan.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.skinButton_net_scan.MouseBack = null;
            this.skinButton_net_scan.Name = "skinButton_net_scan";
            this.skinButton_net_scan.NormlBack = null;
            this.skinButton_net_scan.Size = new System.Drawing.Size(112, 34);
            this.skinButton_net_scan.TabIndex = 4;
            this.skinButton_net_scan.Text = "Scan";
            this.skinButton_net_scan.UseVisualStyleBackColor = false;
            this.skinButton_net_scan.Click += new System.EventHandler(this.skinButton_net_scan_Click);
            // 
            // skinWaterTextBox_remote_port
            // 
            this.skinWaterTextBox_remote_port.Location = new System.Drawing.Point(138, 60);
            this.skinWaterTextBox_remote_port.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.skinWaterTextBox_remote_port.Name = "skinWaterTextBox_remote_port";
            this.skinWaterTextBox_remote_port.Size = new System.Drawing.Size(124, 28);
            this.skinWaterTextBox_remote_port.TabIndex = 3;
            this.skinWaterTextBox_remote_port.WaterColor = System.Drawing.Color.FromArgb(((int)(((byte)(127)))), ((int)(((byte)(127)))), ((int)(((byte)(127)))));
            this.skinWaterTextBox_remote_port.WaterText = "";
            // 
            // skinWaterTextBox_remote_ip
            // 
            this.skinWaterTextBox_remote_ip.Location = new System.Drawing.Point(105, 18);
            this.skinWaterTextBox_remote_ip.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.skinWaterTextBox_remote_ip.Name = "skinWaterTextBox_remote_ip";
            this.skinWaterTextBox_remote_ip.Size = new System.Drawing.Size(158, 28);
            this.skinWaterTextBox_remote_ip.TabIndex = 2;
            this.skinWaterTextBox_remote_ip.WaterColor = System.Drawing.Color.FromArgb(((int)(((byte)(127)))), ((int)(((byte)(127)))), ((int)(((byte)(127)))));
            this.skinWaterTextBox_remote_ip.WaterText = "";
            // 
            // skinLabel_port
            // 
            this.skinLabel_port.AutoSize = true;
            this.skinLabel_port.BackColor = System.Drawing.Color.Transparent;
            this.skinLabel_port.BorderColor = System.Drawing.Color.White;
            this.skinLabel_port.Font = new System.Drawing.Font("微软雅黑", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.skinLabel_port.Location = new System.Drawing.Point(4, 63);
            this.skinLabel_port.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.skinLabel_port.Name = "skinLabel_port";
            this.skinLabel_port.Size = new System.Drawing.Size(116, 24);
            this.skinLabel_port.TabIndex = 1;
            this.skinLabel_port.Text = "Reader Port:";
            // 
            // skinLabel_ip
            // 
            this.skinLabel_ip.AutoSize = true;
            this.skinLabel_ip.BackColor = System.Drawing.Color.Transparent;
            this.skinLabel_ip.BorderColor = System.Drawing.Color.White;
            this.skinLabel_ip.Font = new System.Drawing.Font("微软雅黑", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.skinLabel_ip.Location = new System.Drawing.Point(2, 21);
            this.skinLabel_ip.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.skinLabel_ip.Name = "skinLabel_ip";
            this.skinLabel_ip.Size = new System.Drawing.Size(96, 24);
            this.skinLabel_ip.TabIndex = 0;
            this.skinLabel_ip.Text = "Reader IP:";
            // 
            // skinComboBox_interface
            // 
            this.skinComboBox_interface.DrawMode = System.Windows.Forms.DrawMode.OwnerDrawFixed;
            this.skinComboBox_interface.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.skinComboBox_interface.FormattingEnabled = true;
            this.skinComboBox_interface.Items.AddRange(new object[] {
            "RS232/RS485",
            "RJ45"});
            this.skinComboBox_interface.Location = new System.Drawing.Point(99, 8);
            this.skinComboBox_interface.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.skinComboBox_interface.Name = "skinComboBox_interface";
            this.skinComboBox_interface.Size = new System.Drawing.Size(144, 29);
            this.skinComboBox_interface.TabIndex = 15;
            this.skinComboBox_interface.WaterText = "";
            this.skinComboBox_interface.SelectedIndexChanged += new System.EventHandler(this.skinComboBox1_SelectedIndexChanged);
            // 
            // skinLabel_interface
            // 
            this.skinLabel_interface.AutoSize = true;
            this.skinLabel_interface.BackColor = System.Drawing.Color.Transparent;
            this.skinLabel_interface.BorderColor = System.Drawing.Color.White;
            this.skinLabel_interface.Font = new System.Drawing.Font("微软雅黑", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.skinLabel_interface.Location = new System.Drawing.Point(6, 12);
            this.skinLabel_interface.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.skinLabel_interface.Name = "skinLabel_interface";
            this.skinLabel_interface.Size = new System.Drawing.Size(89, 24);
            this.skinLabel_interface.TabIndex = 14;
            this.skinLabel_interface.Text = "Interface:";
            // 
            // skinButton_connect
            // 
            this.skinButton_connect.BackColor = System.Drawing.Color.Transparent;
            this.skinButton_connect.ControlState = CCWin.SkinClass.ControlState.Normal;
            this.skinButton_connect.DownBack = null;
            this.skinButton_connect.Location = new System.Drawing.Point(80, 285);
            this.skinButton_connect.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.skinButton_connect.MouseBack = null;
            this.skinButton_connect.Name = "skinButton_connect";
            this.skinButton_connect.NormlBack = null;
            this.skinButton_connect.Size = new System.Drawing.Size(144, 38);
            this.skinButton_connect.TabIndex = 13;
            this.skinButton_connect.Text = "Connect";
            this.skinButton_connect.UseVisualStyleBackColor = false;
            this.skinButton_connect.Click += new System.EventHandler(this.skinButton_connect_Click);
            // 
            // skinPictureBox_welcom
            // 
            this.skinPictureBox_welcom.BackColor = System.Drawing.Color.Transparent;
            this.skinPictureBox_welcom.Image = ((System.Drawing.Image)(resources.GetObject("skinPictureBox_welcom.Image")));
            this.skinPictureBox_welcom.Location = new System.Drawing.Point(319, 27);
            this.skinPictureBox_welcom.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.skinPictureBox_welcom.Name = "skinPictureBox_welcom";
            this.skinPictureBox_welcom.Size = new System.Drawing.Size(879, 594);
            this.skinPictureBox_welcom.TabIndex = 15;
            this.skinPictureBox_welcom.TabStop = false;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(9F, 18F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.AutoSize = true;
            this.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(242)))), ((int)(((byte)(254)))), ((int)(((byte)(220)))));
            this.ClientSize = new System.Drawing.Size(1215, 838);
            this.Controls.Add(this.skinPictureBox_welcom);
            this.Controls.Add(this.skinPanel_connection);
            this.Controls.Add(this.listView_result);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.Margin = new System.Windows.Forms.Padding(4, 4, 4, 4);
            this.MaximizeBox = false;
            this.Name = "Form1";
            this.Text = "UHF RFID Test Demo V1.1.2";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.Form1_FormClosing);
            this.Load += new System.EventHandler(this.Form1_Load);
            this.skinPanel_serialport.ResumeLayout(false);
            this.skinPanel_serialport.PerformLayout();
            this.skinPanel_connection.ResumeLayout(false);
            this.skinPanel_connection.PerformLayout();
            this.skinPanel_network.ResumeLayout(false);
            this.skinPanel_network.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.skinPictureBox_welcom)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion

        private CCWin.SkinControl.SkinComboBox skinComboBox_serial_port;
        private CCWin.SkinControl.SkinLabel skinLabel_serialport_num;
        private CCWin.SkinControl.SkinButton skinButton_fresh;
        private CCWin.SkinControl.SkinListView listView_result;
        private System.Windows.Forms.ColumnHeader columnHeader_time;
        private System.Windows.Forms.ColumnHeader columnHeader_text;
        private CCWin.SkinControl.SkinPanel skinPanel_serialport;
        private CCWin.SkinControl.SkinPanel skinPanel_connection;
        private CCWin.SkinControl.SkinComboBox skinComboBox_interface;
        private CCWin.SkinControl.SkinLabel skinLabel_interface;
        private CCWin.SkinControl.SkinButton skinButton_connect;
        private CCWin.SkinControl.SkinPanel skinPanel_network;
        private CCWin.SkinControl.SkinLabel skinLabel_ip;
        private CCWin.SkinControl.SkinLabel skinLabel_port;
        private CCWin.SkinControl.SkinWaterTextBox skinWaterTextBox_remote_port;
        private CCWin.SkinControl.SkinWaterTextBox skinWaterTextBox_remote_ip;
        private CCWin.SkinControl.SkinComboBox skinComboBox_net_protocol;
        private CCWin.SkinControl.SkinLabel skinLabel1;
        private CCWin.SkinControl.SkinButton skinButton_net_scan;
        private CCWin.SkinControl.SkinPictureBox skinPictureBox_welcom;
        private CCWin.SkinControl.SkinButton skinButton_tcp_server;
        private CCWin.SkinControl.SkinWaterTextBox skinWaterTextBox_local_port;
        private CCWin.SkinControl.SkinLabel skinLabel2;
        private CCWin.SkinControl.SkinComboBox skinComboBox_baudrate;
        private CCWin.SkinControl.SkinLabel skinLabel3;
    }
}

