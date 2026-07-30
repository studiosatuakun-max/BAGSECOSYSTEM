namespace RfidReader
{
    partial class TcpServerWindows
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.skinPanel1 = new CCWin.SkinControl.SkinPanel();
            this.skinButton_stop = new CCWin.SkinControl.SkinButton();
            this.skinButton_listen = new CCWin.SkinControl.SkinButton();
            this.skinWaterTextBox_listen_port = new CCWin.SkinControl.SkinWaterTextBox();
            this.skinLabel1 = new CCWin.SkinControl.SkinLabel();
            this.skinComboBox_pc_interface = new CCWin.SkinControl.SkinComboBox();
            this.skinLabel_interface = new CCWin.SkinControl.SkinLabel();
            this.skinListView_ip_list = new CCWin.SkinControl.SkinListView();
            this.columnHeader_none = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader_ip = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader_port = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.skinListView_tags = new CCWin.SkinControl.SkinListView();
            this.columnHeader_id_none = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader_tags_ip = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader_tags_data = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader_rssi = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader_tags_count = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader_heart_beats = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.skinPanel1.SuspendLayout();
            this.SuspendLayout();
            // 
            // skinPanel1
            // 
            this.skinPanel1.BackColor = System.Drawing.Color.Transparent;
            this.skinPanel1.BorderColor = System.Drawing.Color.DarkCyan;
            this.skinPanel1.Controls.Add(this.skinButton_stop);
            this.skinPanel1.Controls.Add(this.skinButton_listen);
            this.skinPanel1.Controls.Add(this.skinWaterTextBox_listen_port);
            this.skinPanel1.Controls.Add(this.skinLabel1);
            this.skinPanel1.Controls.Add(this.skinComboBox_pc_interface);
            this.skinPanel1.Controls.Add(this.skinLabel_interface);
            this.skinPanel1.ControlState = CCWin.SkinClass.ControlState.Normal;
            this.skinPanel1.DownBack = null;
            this.skinPanel1.Location = new System.Drawing.Point(5, 5);
            this.skinPanel1.MouseBack = null;
            this.skinPanel1.Name = "skinPanel1";
            this.skinPanel1.NormlBack = null;
            this.skinPanel1.Size = new System.Drawing.Size(245, 114);
            this.skinPanel1.TabIndex = 0;
            // 
            // skinButton_stop
            // 
            this.skinButton_stop.BackColor = System.Drawing.Color.Transparent;
            this.skinButton_stop.ControlState = CCWin.SkinClass.ControlState.Normal;
            this.skinButton_stop.DownBack = null;
            this.skinButton_stop.Location = new System.Drawing.Point(149, 84);
            this.skinButton_stop.MouseBack = null;
            this.skinButton_stop.Name = "skinButton_stop";
            this.skinButton_stop.NormlBack = null;
            this.skinButton_stop.Size = new System.Drawing.Size(57, 23);
            this.skinButton_stop.TabIndex = 6;
            this.skinButton_stop.Text = "Stop";
            this.skinButton_stop.UseVisualStyleBackColor = false;
            this.skinButton_stop.Click += new System.EventHandler(this.skinButton_stop_Click);
            // 
            // skinButton_listen
            // 
            this.skinButton_listen.BackColor = System.Drawing.Color.Transparent;
            this.skinButton_listen.ControlState = CCWin.SkinClass.ControlState.Normal;
            this.skinButton_listen.DownBack = null;
            this.skinButton_listen.Location = new System.Drawing.Point(31, 84);
            this.skinButton_listen.MouseBack = null;
            this.skinButton_listen.Name = "skinButton_listen";
            this.skinButton_listen.NormlBack = null;
            this.skinButton_listen.Size = new System.Drawing.Size(60, 23);
            this.skinButton_listen.TabIndex = 5;
            this.skinButton_listen.Text = "Listen";
            this.skinButton_listen.UseVisualStyleBackColor = false;
            this.skinButton_listen.Click += new System.EventHandler(this.skinButton_listen_Click);
            // 
            // skinWaterTextBox_listen_port
            // 
            this.skinWaterTextBox_listen_port.Location = new System.Drawing.Point(85, 48);
            this.skinWaterTextBox_listen_port.Name = "skinWaterTextBox_listen_port";
            this.skinWaterTextBox_listen_port.Size = new System.Drawing.Size(100, 21);
            this.skinWaterTextBox_listen_port.TabIndex = 3;
            this.skinWaterTextBox_listen_port.WaterColor = System.Drawing.Color.FromArgb(((int)(((byte)(127)))), ((int)(((byte)(127)))), ((int)(((byte)(127)))));
            this.skinWaterTextBox_listen_port.WaterText = "";
            // 
            // skinLabel1
            // 
            this.skinLabel1.AutoSize = true;
            this.skinLabel1.BackColor = System.Drawing.Color.Transparent;
            this.skinLabel1.BorderColor = System.Drawing.Color.White;
            this.skinLabel1.Font = new System.Drawing.Font("微软雅黑", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.skinLabel1.Location = new System.Drawing.Point(8, 51);
            this.skinLabel1.Name = "skinLabel1";
            this.skinLabel1.Size = new System.Drawing.Size(72, 17);
            this.skinLabel1.TabIndex = 2;
            this.skinLabel1.Text = "Listen Port:";
            // 
            // skinComboBox_pc_interface
            // 
            this.skinComboBox_pc_interface.DrawMode = System.Windows.Forms.DrawMode.OwnerDrawFixed;
            this.skinComboBox_pc_interface.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.skinComboBox_pc_interface.FormattingEnabled = true;
            this.skinComboBox_pc_interface.Location = new System.Drawing.Point(85, 12);
            this.skinComboBox_pc_interface.Name = "skinComboBox_pc_interface";
            this.skinComboBox_pc_interface.Size = new System.Drawing.Size(137, 22);
            this.skinComboBox_pc_interface.TabIndex = 1;
            this.skinComboBox_pc_interface.WaterText = "";
            // 
            // skinLabel_interface
            // 
            this.skinLabel_interface.AutoSize = true;
            this.skinLabel_interface.BackColor = System.Drawing.Color.Transparent;
            this.skinLabel_interface.BorderColor = System.Drawing.Color.White;
            this.skinLabel_interface.Font = new System.Drawing.Font("微软雅黑", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.skinLabel_interface.Location = new System.Drawing.Point(17, 14);
            this.skinLabel_interface.Name = "skinLabel_interface";
            this.skinLabel_interface.Size = new System.Drawing.Size(62, 17);
            this.skinLabel_interface.TabIndex = 0;
            this.skinLabel_interface.Text = "Interface:";
            // 
            // skinListView_ip_list
            // 
            this.skinListView_ip_list.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.columnHeader_none,
            this.columnHeader_ip,
            this.columnHeader_port,
            this.columnHeader_heart_beats});
            this.skinListView_ip_list.Location = new System.Drawing.Point(257, 5);
            this.skinListView_ip_list.Name = "skinListView_ip_list";
            this.skinListView_ip_list.OwnerDraw = true;
            this.skinListView_ip_list.Size = new System.Drawing.Size(316, 114);
            this.skinListView_ip_list.TabIndex = 1;
            this.skinListView_ip_list.UseCompatibleStateImageBehavior = false;
            this.skinListView_ip_list.View = System.Windows.Forms.View.Details;
            // 
            // columnHeader_none
            // 
            this.columnHeader_none.Text = "none";
            this.columnHeader_none.Width = 0;
            // 
            // columnHeader_ip
            // 
            this.columnHeader_ip.Text = "Client IP";
            this.columnHeader_ip.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.columnHeader_ip.Width = 156;
            // 
            // columnHeader_port
            // 
            this.columnHeader_port.Text = "Port";
            this.columnHeader_port.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.columnHeader_port.Width = 69;
            // 
            // skinListView_tags
            // 
            this.skinListView_tags.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.columnHeader_id_none,
            this.columnHeader_tags_ip,
            this.columnHeader_tags_data,
            this.columnHeader_rssi,
            this.columnHeader_tags_count});
            this.skinListView_tags.Location = new System.Drawing.Point(5, 125);
            this.skinListView_tags.Name = "skinListView_tags";
            this.skinListView_tags.OwnerDraw = true;
            this.skinListView_tags.Size = new System.Drawing.Size(568, 229);
            this.skinListView_tags.TabIndex = 2;
            this.skinListView_tags.UseCompatibleStateImageBehavior = false;
            this.skinListView_tags.View = System.Windows.Forms.View.Details;
            // 
            // columnHeader_id_none
            // 
            this.columnHeader_id_none.Text = "None";
            this.columnHeader_id_none.Width = 0;
            // 
            // columnHeader_tags_ip
            // 
            this.columnHeader_tags_ip.Text = "IP Address";
            this.columnHeader_tags_ip.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.columnHeader_tags_ip.Width = 174;
            // 
            // columnHeader_tags_data
            // 
            this.columnHeader_tags_data.Text = "Tag Data";
            this.columnHeader_tags_data.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.columnHeader_tags_data.Width = 244;
            // 
            // columnHeader_rssi
            // 
            this.columnHeader_rssi.Text = "RSSI";
            this.columnHeader_rssi.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.columnHeader_rssi.Width = 86;
            // 
            // columnHeader_tags_count
            // 
            this.columnHeader_tags_count.Text = "Times";
            this.columnHeader_tags_count.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // columnHeader_heart_beats
            // 
            this.columnHeader_heart_beats.Text = "Heart Beat";
            this.columnHeader_heart_beats.Width = 87;
            // 
            // TcpServerWindows
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(573, 357);
            this.ControlBox = false;
            this.Controls.Add(this.skinListView_tags);
            this.Controls.Add(this.skinListView_ip_list);
            this.Controls.Add(this.skinPanel1);
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "TcpServerWindows";
            this.ShowIcon = false;
            this.ShowInTaskbar = false;
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.TcpServerWindows_FormClosing);
            this.skinPanel1.ResumeLayout(false);
            this.skinPanel1.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private CCWin.SkinControl.SkinPanel skinPanel1;
        private CCWin.SkinControl.SkinLabel skinLabel_interface;
        private CCWin.SkinControl.SkinComboBox skinComboBox_pc_interface;
        private CCWin.SkinControl.SkinButton skinButton_stop;
        private CCWin.SkinControl.SkinButton skinButton_listen;
        private CCWin.SkinControl.SkinWaterTextBox skinWaterTextBox_listen_port;
        private CCWin.SkinControl.SkinLabel skinLabel1;
        private CCWin.SkinControl.SkinListView skinListView_ip_list;
        private System.Windows.Forms.ColumnHeader columnHeader_none;
        private System.Windows.Forms.ColumnHeader columnHeader_ip;
        private System.Windows.Forms.ColumnHeader columnHeader_port;
        private CCWin.SkinControl.SkinListView skinListView_tags;
        private System.Windows.Forms.ColumnHeader columnHeader_id_none;
        private System.Windows.Forms.ColumnHeader columnHeader_tags_ip;
        private System.Windows.Forms.ColumnHeader columnHeader_tags_data;
        private System.Windows.Forms.ColumnHeader columnHeader_tags_count;
        private System.Windows.Forms.ColumnHeader columnHeader_rssi;
        private System.Windows.Forms.ColumnHeader columnHeader_heart_beats;
    }
}