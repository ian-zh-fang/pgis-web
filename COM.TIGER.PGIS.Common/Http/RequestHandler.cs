using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Common.Http
{
    /// <summary>
    /// 模拟HTTP协议请求
    /// </summary>
    public sealed class RequestHandler
    {
        private static RequestHandler _handler = null;
        /// <summary>
        /// 模拟请求处理程序唯一实例
        /// </summary>
        public static RequestHandler Handler
        {
            get 
            {
                _handler = _handler ?? new RequestHandler();
                return _handler;
            }
        }

        private RequestHandler() { }

        /// <summary>
        /// 执行请求，获取返回值
        /// </summary>
        /// <param name="url">请求的地址</param>
        /// <param name="method">HTTP模拟请求的方法</param>
        /// <returns></returns>
        public RequestResult<T> Execute<T>(string url, RequestMethod method) where T : new()
        {
            var request = GetRequest(url, method);
            var context = GetContext(request);
            var data = Newtonsoft.Json.JsonConvert.DeserializeObject<RequestResult<T>>(context);
            return data;
        }

        /// <summary>
        /// 获取请求数据正文
        /// </summary>
        /// <param name="request">模拟发起的请求</param>
        /// <returns></returns>
        private string GetContext(System.Net.HttpWebRequest request)
        {
            var ret = string.Empty;
            using (var response = (System.Net.HttpWebResponse)request.GetResponse())
            {
                var stream = response.GetResponseStream();
                var reader = new System.IO.StreamReader(stream);
                ret = reader.ReadToEnd();
                stream.Close();
                reader.Close();
            }
            return ret;
        }

        /// <summary>
        /// 获取模拟HTTP请求的System.Net.HttpWebRequest实例
        /// </summary>
        /// <param name="url">请求地址</param>
        /// <param name="method">请求方法</param>
        /// <returns></returns>
        private System.Net.HttpWebRequest GetRequest(string url, RequestMethod method)
        {
            if (string.IsNullOrWhiteSpace(url)) 
                throw new ArgumentNullException("url", "url no empty!");
            
            var request = (System.Net.HttpWebRequest)System.Net.WebRequest.Create(url);
            request.Method = GetMethod(method);
            //request.ContentType = "text/json";
            request.ContentType = "application/x-www-form-urlencoded";
            request.UserAgent = "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1) ; .NET CLR 2.0.50727; .NET CLR 3.0.04506.648; .NET CLR 3.5.21022)";
            request.ContentLength = 0;
            request.CookieContainer = new System.Net.CookieContainer();

            return request;
        }

        /// <summary>
        /// 获取模拟请求方式
        /// </summary>
        /// <param name="method">模拟请求方式</param>
        /// <returns></returns>
        private string GetMethod(RequestMethod method)
        {
            var ret = "POST";
            switch (method) 
            {
                case RequestMethod.DELETE:
                    ret = "DELETE";
                    break;
                case RequestMethod.GET:
                    ret = "GET";
                    break;
                case RequestMethod.POST:
                    ret = "POST";
                    break;
                case RequestMethod.PUT:
                    ret = "PUT";
                    break;
                default: break;
            }
            return ret;
        }

        /// <summary>
        /// 模拟请求方式（枚举类型）
        /// </summary>
        public enum RequestMethod : byte
        {
            POST = 0x00,
            GET,
            PUT,
            DELETE,
        }

        /// <summary>
        /// 模拟请求的结果
        /// </summary>
        public class RequestResult<T>
        {
            /// <summary>
            /// 模拟请求回传的消息正文
            /// <para>包含远程服务执行失败的描述信息。执行成功，返回OK</para>
            /// </summary>
            public string Message { get; set; }

            /// <summary>
            /// 模拟请求的返回代码
            /// <para>包含远程服务执行结果代码。执行成功，返回200</para>
            /// </summary>
            public int Status { get; set; }

            /// <summary>
            /// 模拟请求的返回结果
            /// <para>包含远程服务执行结果。执行失败，返回NULL</para>
            /// </summary>
            public T Result { get; set; }
        }
    }
}
