using System.Runtime.Serialization;

namespace Oftalvista.Api.Application.Commands
{
    public class AuditoriaCommand
    {
        [DataMember]
        public Guid UsuarioRegistro { get; set; }
        [DataMember]
        public DateTime? FechaRegistro { get; set; }
        [DataMember]
        public string IpRegistro { get; set; }
    }
}
