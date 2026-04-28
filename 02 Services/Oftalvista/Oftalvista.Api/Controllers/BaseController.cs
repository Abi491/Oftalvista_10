using Microsoft.AspNetCore.Mvc;

namespace Oftalvista.Api.Controllers
{
    public class BaseController : ControllerBase
    {
        protected string IpCliente
        {
            get
            {
                if (Request.Headers.ContainsKey("IpClient"))
                {
                    return Request.Headers["IpClient"].ToString();
                }
                return HttpContext.Connection.RemoteIpAddress.ToString();
            }
        }

    }
}
