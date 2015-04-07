using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using COM.TIGER.PGIS.Common.XML;

namespace UnitTestProject.XML
{
    [TestClass]
    public class HandlerTest
    {
        [TestMethod]
        public void Test()
        {
            //返回文件全路径
            var path = string.Format("{0}/test.xml", Environment.CurrentDirectory);
            //移除原本的文件
            if (System.IO.File.Exists(path)) System.IO.File.Delete(path);
            //创建新的文件
            var handler = XMLHandler.CreateXML(path);
            //断言
            Assert.IsNotNull(handler);
            Assert.IsNotNull(handler.Doc);
            Assert.IsNotNull(handler.Root);
            //添加新的子代元素
            AddXmlNode(handler);
            //获取所有的根节点子代元素信息
            var elements = handler.GetElements();
            Assert.IsTrue(elements.Length == 5);
            
            elements = handler.Root.GetElements("attr");
            Assert.IsTrue(elements.Length == 5);

            elements = handler.Root.GetElements(new string[] { "attr" }, "*");
            Assert.IsTrue(elements.Length == 5);

            elements = handler.Root.GetElements(new string[] { "attr" }, "1", "2");
            Assert.IsTrue(elements.Length == 2);

            elements = handler.Root.GetElements(new string[] { "attr", "a" }, "1", "2");
            Assert.IsTrue(elements.Length == 0);

            elements = handler.Root.GetElements(new string[] { "attr", "a" }, "1", "2", "*");
            Assert.IsTrue(elements.Length == 0);

            elements = handler.Root.GetElements(new string[] { "attr" }, "1", "2", "*");
            Assert.IsTrue(elements.Length == 5);
        }

        //添加新的节点信息
        private void AddXmlNode(XMLHandler handler)
        {
            for (var i = 0; i < 5; i++)
            {
                var e = handler.Doc.CreateElement("tag");
                e.SetAttribute("attr", string.Format("{0}", i));
                handler.Root.AppendChild(e);
            }
            handler.Save();
        }
    }
}
