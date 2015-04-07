using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Common.File
{
    /// <summary>
    /// 文件下载 Handler
    /// </summary>
    public sealed class FileDownload
    {
        /// <summary>
        /// 下载指定的文件
        /// </summary>
        /// <param name="filename">下载之后的文件名称</param>
        /// <param name="filepath">指定的文件。文件全物理路径</param>
        /// <param name="response"></param>
        public static void HttpDownLoad(string filename, string filepath, System.Web.HttpResponse response = null)
        {
            byte[] buffer = null;
            System.IO.FileStream stream = null;
            try
            {
                stream = new System.IO.FileStream(filepath, System.IO.FileMode.Open, System.IO.FileAccess.Read);
                buffer = new byte[stream.Length];
                stream.Read(buffer, 0, buffer.Length); 
            }
            catch (Exception) {
                buffer = new byte[0];
            }
            finally {

                response = response ?? System.Web.HttpContext.Current.Response;
                response.ContentType = "application/octet-stream";
                response.AddHeader("Content-Disposition", string.Format("attachment; filename={0}", System.Web.HttpUtility.UrlEncode(filename, System.Text.Encoding.UTF8)));
                response.BinaryWrite(buffer);
                response.Flush();
                response.End();

                if (stream != null)
                    stream.Close();
            }
        }
    }
}
