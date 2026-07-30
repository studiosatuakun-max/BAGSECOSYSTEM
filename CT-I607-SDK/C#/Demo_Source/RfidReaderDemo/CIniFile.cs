using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Runtime.InteropServices;
using System.Collections;
using System.Collections.Specialized;

namespace ConfigureFile
{
    /// <summary>
    ///  http://blog.csdn.net/yysyangyangyangshan/article/details/7017523
    /// </summary>
    class CIniFile
    {
        [DllImport("kernel32")]
        private static extern long WritePrivateProfileString(string section, string key, string val, string filePath);

        [DllImport("kernel32")]
        private static extern int GetPrivateProfileString(string lpAppName, string lpKeyName, string lpDefault, StringBuilder lpReturnedString, int nSize, string lpFileName);

        [DllImport("kernel32.dll", CharSet = CharSet.Auto)]
        private static extern uint GetPrivateProfileSection(string lpAppName, IntPtr lpReturnedString, uint nSize, string lpFileName);

        public static String IniFiles(string ini_file_path,ref Boolean file_create_flag)
        {
            file_create_flag = false;
            // 判断文件是否存在 
            FileInfo fileInfo = new FileInfo(ini_file_path);
            //Todo:搞清枚举的用法 
            if ((!fileInfo.Exists))
            { //|| (FileAttributes.Directory in fileInfo.Attributes)) 
                //文件不存在，建立文件 
                System.IO.StreamWriter sw = new System.IO.StreamWriter(ini_file_path, false, System.Text.Encoding.Default);
                try
                {
                    sw.Write("#Downloader configure file");
                    sw.Close();
                    file_create_flag = true;
                }
                catch
                {
                    throw (new ApplicationException("Ini文件不存在"));
                }
            }
            //必须是完全路径，不能是相对路径 
            return fileInfo.FullName;
        }

        private static string ReadString(string section, string key, string def, string filePath)
        {
            //StringBuilder temp = new StringBuilder(1024);
            StringBuilder temp = new StringBuilder(128);   //申请的空间不用太大
            temp.Clear();
            try
            {
                GetPrivateProfileString(section, key, def, temp, 128, filePath);
            }
            catch
            { 
            }
            return temp.ToString();
        }

        public static Int64 ReadNum(string section, string key, string def, string filePath)
        {
            //StringBuilder temp = new StringBuilder(1024);
            StringBuilder temp = new StringBuilder(128);   //申请的空间不用太大
            temp.Clear();
            try
            {
                GetPrivateProfileString(section, key, def, temp, 128, filePath);
            }
            catch
            {
            }
            return Int64.Parse(temp.ToString());
        }

        /// <summary>  
        /// 根据section取所有key  
        /// </summary>  
        /// <param name="section"></param>  
        /// <param name="filePath"></param>  
        /// <returns></returns>  
        public static string[] ReadIniAllKeys(string section, string filePath)
        {
            UInt32 MAX_BUFFER = 32767;

            string[] items = new string[0];

            IntPtr pReturnedString = Marshal.AllocCoTaskMem((int)MAX_BUFFER * sizeof(char));

            UInt32 bytesReturned = GetPrivateProfileSection(section, pReturnedString, MAX_BUFFER, filePath);

            if (!(bytesReturned == MAX_BUFFER - 2) || (bytesReturned == 0))
            {
                string returnedString = Marshal.PtrToStringAuto(pReturnedString, (int)bytesReturned);

                items = returnedString.Split(new char[] { '\0' }, StringSplitOptions.RemoveEmptyEntries);
            }

            Marshal.FreeCoTaskMem(pReturnedString);

            return items;
        }

        /// <summary>  
        /// 根据section，key取值  
        /// </summary>  
        /// <param name="section"></param>  
        /// <param name="keys"></param>  
        /// <param name="filePath">ini文件路径</param>  
        /// <returns></returns>  
        public static string ReadIniKeys(string section, string keys, string filePath)
        {
            return ReadString(section, keys, "", filePath);
        }

        /// <summary>  
        /// 保存ini  
        /// </summary>  
        /// <param name="section"></param>  
        /// <param name="key"></param>  
        /// <param name="value"></param>  
        /// <param name="filePath">ini文件路径</param>  
        /// WriteIniKeys(section, key, null, recordIniPath) 删除某一项
        public static void WriteIniKeys(string section, string key, string value, string filePath)
        {
            WritePrivateProfileString(section, key, value, filePath);
        }


    }
}
