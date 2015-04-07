using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Xml;

namespace COM.TIGER.PGIS.Common.XML
{
    /// <summary>
    /// XML处理程序
    /// </summary>
    public sealed class XMLHandler
    {
        //setting singleton instance
        private XMLHandler() { }
                
        private string _path;
        /// <summary>
        /// XML文件路径
        /// </summary>
        public string Path
        {
            get { return _path; }
        }

        private XmlDocument _doc;
        /// <summary>
        /// XMLDocument XML文档
        /// </summary>
        public XmlDocument Doc
        {
            get { return _doc; }
        }

        private XmlElement _root;
        /// <summary>
        /// XMLNode XML根节点
        /// </summary>
        public XmlElement Root
        {
            get { return _root; }
        }

        /// <summary>
        /// 创建新的XML文件。如果XML文件存在，则加载当前文件
        /// </summary>
        /// <param name="path">文件全路径名</param>
        /// <returns></returns>
        public static XMLHandler CreateXML(string path)
        {
            if (string.IsNullOrWhiteSpace(path))
                throw new ArgumentNullException("path");
            //校验文件目录
            var index = path.LastIndexOf('\\');
            if (index > 0)
            {
                var dicpth = path.Substring(0, index);

                if (!Directory.Exists(dicpth)) Directory.CreateDirectory(dicpth);
            }
            
            //校验文件
            //文件不存在，创建文件
            if (!System.IO.File.Exists(path))
            {
                var doc = new XmlDocument();
                doc.AppendChild(doc.CreateXmlDeclaration("1.0", "utf-8", null));
                var root = doc.CreateElement("Root");
                root.InnerText = string.Empty;
                doc.AppendChild(root);
                doc.Save(path);
            }
            //加载文件
            return LoadDocument(path);
        }

        /// <summary>
        /// 加载XML文档信息
        /// </summary>
        /// <param name="path">XML文档路径</param>
        public static XMLHandler LoadDocument(string path)
        {
            if (string.IsNullOrWhiteSpace(path)) 
                throw new ArgumentNullException("path");

            XMLHandler handler = new XMLHandler();
            handler._path = path;
            handler._doc = new XmlDocument();
            handler._doc.RemoveAll();
            handler._doc.Load(path);
            handler._root = handler._doc.DocumentElement;
            return handler;
        }

        /// <summary>
        /// 加载XML文档信息
        /// </summary>
        /// <param name="xmlContext">XML文档内容</param>
        public static XMLHandler LoadXMLDocument(string xmlContext)
        {
            if (string.IsNullOrWhiteSpace(xmlContext))
                throw new ArgumentNullException("xmlContext");

            XMLHandler handler = new XMLHandler();
            handler._doc = new XmlDocument();
            handler._doc.RemoveAll();
            handler._doc.LoadXml(xmlContext);
            handler._root = handler._doc.DocumentElement;
            return handler;
        }

        /// <summary>
        /// 获取根节点的所有子节点
        /// </summary>
        /// <returns></returns>
        public XmlElement[] GetElements()
        {
            return _root.ChildNodes.ToArray<XmlElement>();
        }

        /// <summary>
        /// 保存文件
        /// </summary>
        public void Save()
        {
            if (string.IsNullOrWhiteSpace(_path))
                throw new ArgumentNullException("path", "file no found.");

            _doc.Save(_path);
        }
    }
}
