using System.Windows.Forms;

namespace RfidReader
{
    public partial class ScanWindow:Form
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
            this.skinLabel1 = new CCWin.SkinControl.SkinLabel();
            this.skinWaterTextBox_port = new CCWin.SkinControl.SkinWaterTextBox();
            this.skinButton_scan = new CCWin.SkinControl.SkinButton();
            this.skinButton_stop = new CCWin.SkinControl.SkinButton();
            this.skinListView_devices = new CCWin.SkinControl.SkinListView();
            this.columnHeader_none = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader_IP = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader_mac = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader_port = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader_transport_type = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.columnHeader_local_port = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.skinLabel2 = new CCWin.SkinControl.SkinLabel();
            this.skinComboBox_interface = new CCWin.SkinControl.SkinComboBox();
            this.skinProgressIndicator_scan_flag = new CCWin.SkinControl.SkinProgressIndicator();
            this.skinButton_set = new CCWin.SkinControl.SkinButton();
            this.skinButton_all_reset = new CCWin.SkinControl.SkinButton();
            this.SuspendLayout();
            // 
            // skinLabel1
            // 
            this.skinLabel1.AutoSize = true;
            this.skinLabel1.BackColor = System.Drawing.Color.Transparent;
            this.skinLabel1.BorderColor = System.Drawing.Color.White;
            this.skinLabel1.Font = new System.Drawing.Font("Microsoft YaHei", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.skinLabel1.Location = new System.Drawing.Point(12, 49);
            this.skinLabel1.Name = "skinLabel1";
            this.skinLabel1.Size = new System.Drawing.Size(66, 17);
            this.skinLabel1.TabIndex = 0;
            this.skinLabel1.Text = "Scan Port:";
            // 
            // skinWaterTextBox_port
            // 
            this.skinWaterTextBox_port.Location = new System.Drawing.Point(84, 46);
            this.skinWaterTextBox_port.Name = "skinWaterTextBox_port";
            this.skinWaterTextBox_port.Size = new System.Drawing.Size(58, 20);
            this.skinWaterTextBox_port.TabIndex = 1;
            this.skinWaterTextBox_port.WaterColor = System.Drawing.Color.FromArgb(((int)(((byte)(127)))), ((int)(((byte)(127)))), ((int)(((byte)(127)))));
            this.skinWaterTextBox_port.WaterText = "";
            // 
            // skinButton_scan
            // 
            this.skinButton_scan.BackColor = System.Drawing.Color.Transparent;
            this.skinButton_scan.ControlState = CCWin.SkinClass.ControlState.Normal;
            this.skinButton_scan.DownBack = null;
            this.skinButton_scan.Location = new System.Drawing.Point(230, 43);
            this.skinButton_scan.MouseBack = null;
            this.skinButton_scan.Name = "skinButton_scan";
            this.skinButton_scan.NormlBack = null;
            this.skinButton_scan.Size = new System.Drawing.Size(62, 25);
            this.skinButton_scan.TabIndex = 2;
            this.skinButton_scan.Text = "Scan";
            this.skinButton_scan.UseVisualStyleBackColor = false;
            this.skinButton_scan.Click += new System.EventHandler(this.skinButton_scan_Click);
            // 
            // skinButton_stop
            // 
            this.skinButton_stop.BackColor = System.Drawing.Color.Transparent;
            this.skinButton_stop.ControlState = CCWin.SkinClass.ControlState.Normal;
            this.skinButton_stop.DownBack = null;
            this.skinButton_stop.Location = new System.Drawing.Point(298, 43);
            this.skinButton_stop.MouseBack = null;
            this.skinButton_stop.Name = "skinButton_stop";
            this.skinButton_stop.NormlBack = null;
            this.skinButton_stop.Size = new System.Drawing.Size(58, 25);
            this.skinButton_stop.TabIndex = 3;
            this.skinButton_stop.Text = "Stop";
            this.skinButton_stop.UseVisualStyleBackColor = false;
            this.skinButton_stop.Click += new System.EventHandler(this.skinButton_stop_Click);
            // 
            // skinListView_devices
            // 
            this.skinListView_devices.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.columnHeader_none,
            this.columnHeader_IP,
            this.columnHeader_mac,
            this.columnHeader_port,
            this.columnHeader_transport_type,
            this.columnHeader_local_port});
            this.skinListView_devices.FullRowSelect = true;
            this.skinListView_devices.Location = new System.Drawing.Point(9, 77);
            this.skinListView_devices.Name = "skinListView_devices";
            this.skinListView_devices.OwnerDraw = true;
            this.skinListView_devices.RowBackColor2 = System.Drawing.Color.FromArgb(((int)(((byte)(192)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
            this.skinListView_devices.Size = new System.Drawing.Size(486, 316);
            this.skinListView_devices.TabIndex = 4;
            this.skinListView_devices.UseCompatibleStateImageBehavior = false;
            this.skinListView_devices.View = System.Windows.Forms.View.Details;
            // 
            // columnHeader_none
            // 
            this.columnHeader_none.Text = "none";
            this.columnHeader_none.Width = 0;
            // 
            // columnHeader_IP
            // 
            this.columnHeader_IP.Text = "Reader IP";
            this.columnHeader_IP.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.columnHeader_IP.Width = 111;
            // 
            // columnHeader_mac
            // 
            this.columnHeader_mac.Text = "mac";
            this.columnHeader_mac.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.columnHeader_mac.Width = 139;
            // 
            // columnHeader_port
            // 
            this.columnHeader_port.Text = "Port";
            this.columnHeader_port.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.columnHeader_port.Width = 74;
            // 
            // columnHeader_transport_type
            // 
            this.columnHeader_transport_type.Text = "Transport Type";
            this.columnHeader_transport_type.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            this.columnHeader_transport_type.Width = 107;
            // 
            // columnHeader_local_port
            // 
            this.columnHeader_local_port.Text = "Local";
            this.columnHeader_local_port.TextAlign = System.Windows.Forms.HorizontalAlignment.Center;
            // 
            // skinLabel2
            // 
            this.skinLabel2.AutoSize = true;
            this.skinLabel2.BackColor = System.Drawing.Color.Transparent;
            this.skinLabel2.BorderColor = System.Drawing.Color.White;
            this.skinLabel2.Font = new System.Drawing.Font("Microsoft YaHei", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(134)));
            this.skinLabel2.Location = new System.Drawing.Point(12, 10);
            this.skinLabel2.Name = "skinLabel2";
            this.skinLabel2.Size = new System.Drawing.Size(114, 17);
            this.skinLabel2.TabIndex = 5;
            this.skinLabel2.Text = "Ethernet Interface:";
            // 
            // skinComboBox_interface
            // 
            this.skinComboBox_interface.DrawMode = System.Windows.Forms.DrawMode.OwnerDrawFixed;
            this.skinComboBox_interface.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.skinComboBox_interface.FormattingEnabled = true;
            this.skinComboBox_interface.Location = new System.Drawing.Point(132, 10);
            this.skinComboBox_interface.Name = "skinComboBox_interface";
            this.skinComboBox_interface.Size = new System.Drawing.Size(309, 21);
            this.skinComboBox_interface.TabIndex = 6;
            this.skinComboBox_interface.WaterText = "";
            // 
            // skinProgressIndicator_scan_flag
            // 
            this.skinProgressIndicator_scan_flag.BackColor = System.Drawing.Color.Transparent;
            this.skinProgressIndicator_scan_flag.CircleColor = System.Drawing.Color.FromArgb(((int)(((byte)(128)))), ((int)(((byte)(255)))), ((int)(((byte)(255)))));
            this.skinProgressIndicator_scan_flag.Location = new System.Drawing.Point(158, 42);
            this.skinProgressIndicator_scan_flag.Name = "skinProgressIndicator_scan_flag";
            this.skinProgressIndicator_scan_flag.Percentage = 0F;
            this.skinProgressIndicator_scan_flag.Size = new System.Drawing.Size(26, 26);
            this.skinProgressIndicator_scan_flag.TabIndex = 7;
            this.skinProgressIndicator_scan_flag.Text = "Scaning";
            // 
            // skinButton_set
            // 
            this.skinButton_set.BackColor = System.Drawing.Color.Transparent;
            this.skinButton_set.ControlState = CCWin.SkinClass.ControlState.Normal;
            this.skinButton_set.DownBack = null;
            this.skinButton_set.Location = new System.Drawing.Point(362, 43);
            this.skinButton_set.MouseBack = null;
            this.skinButton_set.Name = "skinButton_set";
            this.skinButton_set.NormlBack = null;
            this.skinButton_set.Size = new System.Drawing.Size(67, 25);
            this.skinButton_set.TabIndex = 8;
            this.skinButton_set.Text = "Select";
            this.skinButton_set.UseVisualStyleBackColor = false;
            this.skinButton_set.Click += new System.EventHandler(this.skinButton_set_Click);
            // 
            // skinButton_all_reset
            // 
            this.skinButton_all_reset.BackColor = System.Drawing.Color.Transparent;
            this.skinButton_all_reset.ControlState = CCWin.SkinClass.ControlState.Normal;
            this.skinButton_all_reset.DownBack = null;
            this.skinButton_all_reset.Location = new System.Drawing.Point(435, 43);
            this.skinButton_all_reset.MouseBack = null;
            this.skinButton_all_reset.Name = "skinButton_all_reset";
            this.skinButton_all_reset.NormlBack = null;
            this.skinButton_all_reset.Size = new System.Drawing.Size(60, 25);
            this.skinButton_all_reset.TabIndex = 9;
            this.skinButton_all_reset.Text = "Reset";
            this.skinButton_all_reset.UseVisualStyleBackColor = false;
            this.skinButton_all_reset.Click += new System.EventHandler(this.skinButton_all_reset_Click);
            // 
            // ScanWindow
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(507, 405);
            this.Controls.Add(this.skinButton_all_reset);
            this.Controls.Add(this.skinButton_set);
            this.Controls.Add(this.skinProgressIndicator_scan_flag);
            this.Controls.Add(this.skinComboBox_interface);
            this.Controls.Add(this.skinLabel2);
            this.Controls.Add(this.skinListView_devices);
            this.Controls.Add(this.skinButton_stop);
            this.Controls.Add(this.skinButton_scan);
            this.Controls.Add(this.skinWaterTextBox_port);
            this.Controls.Add(this.skinLabel1);
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "ScanWindow";
            this.ShowIcon = false;
            this.Text = "Scan Rfid Reader Device";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.ScanWindow_FormClosing);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private CCWin.SkinControl.SkinLabel skinLabel1;
        private CCWin.SkinControl.SkinWaterTextBox skinWaterTextBox_port;
        private CCWin.SkinControl.SkinButton skinButton_scan;
        private CCWin.SkinControl.SkinButton skinButton_stop;
        private CCWin.SkinControl.SkinListView skinListView_devices;
        private CCWin.SkinControl.SkinLabel skinLabel2;
        private CCWin.SkinControl.SkinComboBox skinComboBox_interface;
        private CCWin.SkinControl.SkinProgressIndicator skinProgressIndicator_scan_flag;
        private ColumnHeader columnHeader_none;
        private ColumnHeader columnHeader_IP;
        private ColumnHeader columnHeader_mac;
        private ColumnHeader columnHeader_port;
        private ColumnHeader columnHeader_transport_type;
        private CCWin.SkinControl.SkinButton skinButton_set;
        private ColumnHeader columnHeader_local_port;
        private CCWin.SkinControl.SkinButton skinButton_all_reset;
    }
}