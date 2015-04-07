using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using COM.TIGER.PGIS.Dal;
using COM.TIGER.PGIS.Model;
using System.Collections.Generic;

namespace UnitTestProject.COM.TIGER.PGIS.Dal
{
    [TestClass]
    public class DGlobalPositionSystemUnitTest
    {
        private static readonly DGlobalPositionSystem _instance;
        private readonly MGpsDevice _dev;
        static DGlobalPositionSystemUnitTest()
        {
            _instance = new DGlobalPositionSystem();
        }

        public DGlobalPositionSystemUnitTest()
        {
            _dev = new MGpsDevice()
            {
                BindTime = DateTime.Now,
                ID = 100,
                CarID = 100,
                CarNum = "贵C2384",
                DeviceID = "AF4356",
                OfficerID = "2345493"
            };
        }

        [TestMethod]
        public void AddDeviceBinding()
        {
            int result = _instance.AddDeviceBinding(_dev);
            Assert.IsFalse(result > 0);
        }

        [TestMethod]
        public void ModifyDeviceBinding()
        {
            int result = _instance.ModifyDeviceBinding(_dev);
            Assert.IsFalse(result > 0);
        }

        [TestMethod]
        public void RemoveDeviceBinding()
        {
            int result = _instance.RemoveDeviceBinding("ids");
            Assert.IsFalse(result > 0);
        }

        [TestMethod]
        public void PageDevices()
        {
            int index = 1, size = 20;
            TotalClass<List<MGpsDevice>> devices = _instance.PageDevices(index,size);
            Assert.IsNotNull(devices);
            Assert.IsFalse(devices.TotalRecords > 0);
            Assert.IsFalse(devices.Data.Count > 0);
        }

        [TestMethod]
        public void PageDevicesAtNumber()
        {
            int index = 1, size = 20;
            string num = "AFG3002";
            TotalClass<List<MGpsDevice>> devices = _instance.PageDevicesAtNumber(index, size, num);
            Assert.IsNotNull(devices);
            Assert.IsFalse(devices.TotalRecords > 0);
            Assert.IsFalse(devices.Data.Count > 0);
        }

        [TestMethod]
        public void PageDevicesAtOfficer()
        {
            int index = 1, size = 20;
            string id = "10083";
            TotalClass<List<MGpsDevice>> devices = _instance.PageDevicesAtOfficer(index, size, id);
            Assert.IsNotNull(devices);
            Assert.IsFalse(devices.TotalRecords > 0);
            Assert.IsFalse(devices.Data.Count > 0);
        }

        [TestMethod]
        public void PageDevicesAtCar()
        {
            int index = 1, size = 20;
            string id = "贵C20003";
            TotalClass<List<MGpsDevice>> devices = _instance.PageDevicesAtCar(index, size, id);
            Assert.IsNotNull(devices);
            Assert.IsFalse(devices.TotalRecords > 0);
            Assert.IsFalse(devices.Data.Count > 0);
        }

        [TestMethod]
        public void GetDevicesCurrentPosition()
        {
            List<MGpsDeviceTrack> tracks = _instance.GetDevicesCurrentPosition();
            Assert.IsNotNull(tracks);
            Assert.IsFalse(tracks.Count > 0);
        }

        [TestMethod]
        public void GetDeviceHistoryPoints()
        {
            string deviceid = "ED34403";
            DateTime start = DateTime.Now.AddDays(-1), end = DateTime.Now;
            List<MGpsDeviceTrack> tracks = _instance.GetDeviceHistoryPoints(deviceid, start, end);
            Assert.IsNotNull(tracks);
            Assert.IsFalse(tracks.Count > 0);
        }

        [TestMethod]
        public void GetDevicesCurrentPostionAtPanel()
        {
            string coords = string.Join(",", "100", "101", "200", "201", "200", "300", "300", "500");
            List<MGpsDeviceTrack> tracks = _instance.GetDevicesCurrentPostionAtPanel(coords);
            Assert.IsNotNull(tracks);
            Assert.IsFalse(tracks.Count > 0);
        }
    }
}
