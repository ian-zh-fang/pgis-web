using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    public class DHotel:DBase
    {
        private const string CONTROLLERNAME = "Hotel";

        public Model.TotalClass<List<Model.MHotel>> PageHotels(int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MHotel>>>("PageHotels", CONTROLLERNAME,
                string.Format("index={0}", index),
                string.Format("size={0}", size))
                .Result;
        }

        public Model.TotalClass<List<Model.MHotelStay>> GetOnHotel(string id, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MHotelStay>>>("GetOnHotel", CONTROLLERNAME,
                string.Format("id={0}", id),
                string.Format("index={0}", index),
                string.Format("size={0}", size))
                .Result;
        }

        public List<Model.MHotelStay> GetOnRoom(string id, string roomnum, string ptime)
        {
            return Post<List<Model.MHotelStay>>("GetOnRoom", CONTROLLERNAME,
                string.Format("id={0}", id),
                string.Format("roomnum={0}", roomnum),
                string.Format("ptime={0}", ptime))
                .Result;
        }

        public List<Model.MHotelStay> GetOnTogether(string id, string ptime)
        {
            return Post<List<Model.MHotelStay>>("GetOnTogether", CONTROLLERNAME,
                string.Format("id={0}", id),
                string.Format("ptime={0}", ptime))
                .Result;
        }

        public Model.TotalClass<List<Model.MHotelStay>> GetOnMove(string code, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MHotelStay>>>("GetOnMove", CONTROLLERNAME,
                string.Format("code={0}", code),
                string.Format("index={0}", index),
                string.Format("size={0}", size))
                .Result;
        }

        public int UpdateAddress(string id, string addr)
        {
            return Post<int>("UpdateAddress", CONTROLLERNAME,
                string.Format("id={0}", id),
                string.Format("addr={0}", addr))
                .Result;
        }

        public List<Model.MHotel> MatchHotel(string name)
        {
            return Post<List<Model.MHotel>>("MatchHotel", CONTROLLERNAME,
                string.Format("name={0}", name))
                .Result;
        }

        public Model.TotalClass<List<Model.MHotel>> QueryHotel(string name, string addr, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MHotel>>>("QueryHotel", CONTROLLERNAME,
                string.Format("name={0}", name),
                string.Format("addr={0}", addr),
                string.Format("index={0}", index),
                string.Format("size={0}", size))
                .Result;
        }

        public Model.TotalClass<List<Model.MHotelStay>> QueryHotelStay(string name, string code, string hname, string roomnum, string ptime, string gtime, int index, int size)
        {
            return Post<Model.TotalClass<List<Model.MHotelStay>>>("QueryHotelStay", CONTROLLERNAME,
                string.Format("name={0}", name),
                string.Format("code={0}", code),
                string.Format("hname={0}", hname),
                string.Format("roomnum={0}", roomnum),
                string.Format("ptime={0}", ptime),
                string.Format("gtime={0}", gtime),
                string.Format("index={0}", index),
                string.Format("size={0}", size))
                .Result;
        }
    }
}
