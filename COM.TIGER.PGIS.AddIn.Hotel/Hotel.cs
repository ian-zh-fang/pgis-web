using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn.Hotel
{
    [System.ComponentModel.Composition.Export(typeof(IFun.IHotel))]
    public class Hotel:IFun.IHotel
    {
        private Dal.DHotel _instance = new Dal.DHotel();

        public Model.TotalClass<List<Model.MHotel>> PageHotels(int index, int size)
        {
            return _instance.PageHotels(index, size);
        }

        public Model.TotalClass<List<Model.MHotelStay>> GetOnHotel(string id, int index, int size)
        {
            return _instance.GetOnHotel(id, index, size);
        }

        public List<Model.MHotelStay> GetOnRoom(string id, string roomnum, string ptime)
        {
            return _instance.GetOnRoom(id, roomnum, ptime);
        }

        public List<Model.MHotelStay> GetOnTogether(string id, string ptime)
        {
            return _instance.GetOnTogether(id, ptime);
        }

        public Model.TotalClass<List<Model.MHotelStay>> GetOnMove(string id, int index, int size)
        {
            return _instance.GetOnMove(id, index, size);
        }

        public int UpdateAddress(string id, string addr)
        {
            return _instance.UpdateAddress(id, addr);
        }

        public List<Model.MHotel> MatchHotel(string name)
        {
            return _instance.MatchHotel(name);
        }

        public Model.TotalClass<List<Model.MHotel>> QueryHotel(string name, string addr, int index, int size)
        {
            return _instance.QueryHotel(name, addr, index, size);
        }

        public Model.TotalClass<List<Model.MHotelStay>> QueryHotelStay(string name, string code, string hname, string roomnum, string ptime, string gtime, int index, int size)
        {
            return _instance.QueryHotelStay(name, code, hname, roomnum, ptime, gtime, index, size);
        }
    }
}
