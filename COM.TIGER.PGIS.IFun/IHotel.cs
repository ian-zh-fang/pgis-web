using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    /// <summary>
    /// 旅店业
    /// </summary>
    public interface IHotel
    {
        Model.TotalClass<List<Model.MHotel>> PageHotels(int index, int size);

        Model.TotalClass<List<Model.MHotelStay>> GetOnHotel(string id, int index, int size);

        List<Model.MHotelStay> GetOnRoom(string id, string roomnum, string ptime);

        List<Model.MHotelStay> GetOnTogether(string id, string ptime);

        Model.TotalClass<List<Model.MHotelStay>> GetOnMove(string id, int index, int size);

        int UpdateAddress(string id, string addr);

        List<Model.MHotel> MatchHotel(string name);

        Model.TotalClass<List<Model.MHotel>> QueryHotel(string name, string addr, int index, int size);

        Model.TotalClass<List<Model.MHotelStay>> QueryHotelStay(string name, string code, string hname, string roomnum, string ptime, string gtime, int index, int size);
    }
}
