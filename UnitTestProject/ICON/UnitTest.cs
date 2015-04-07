using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace UnitTestProject.ICON
{
    [TestClass]
    public class UnitTest
    {
        [TestMethod]
        public void Test()
        {
            //文件路径信息
            var path = string.Format("{0}\\icon", Environment.CurrentDirectory);
            if (!System.IO.Directory.Exists(path))
                System.IO.Directory.CreateDirectory(path);

            var filename = string.Format("{0}\\icon.css", path);
            if (!System.IO.File.Exists(filename))
                System.IO.File.Create(filename);

            AppendFile(filename);
        }

        private void AppendFile(string filename)
        {
            using (var stream = new System.IO.FileStream(filename, System.IO.FileMode.Open, System.IO.FileAccess.ReadWrite, System.IO.FileShare.ReadWrite))
            {
                stream.Seek(0, System.IO.SeekOrigin.End);
                var context = BuildeContext();
                var buffer = System.Text.Encoding.UTF8.GetBytes(context);
                stream.Write(buffer, 0, buffer.Length);
            }
        }

        private string BuildeContext()
        {
            System.Text.StringBuilder builder = new System.Text.StringBuilder();
            builder.Append("\n/*这里是代码生成的css样式，请勿手动更改*/\n");
            builder.Append(string.Format(".icon_{0}{{\n", DateTime.Now.ToFileTimeUtc()));
            builder.Append(string.Format("\tbackground-image: url(../images/mark/{0}.png) !important;\n", DateTime.Now.ToFileTimeUtc()));
            builder.Append("}");
            return builder.ToString();
        }
    }
}
