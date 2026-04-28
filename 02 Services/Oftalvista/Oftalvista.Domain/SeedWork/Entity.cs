using MediatR;

namespace Oftalvista.Domain.SeedWork
{
    public abstract class Entity : AuditoriaEntity
    {
        int? _requestedHashCode;
        int _Id;
        Guid _Guid;

        public virtual int Id
        {
            get
            {
                return _Id;
            }
            protected set
            {
                _Id = value;
            }
        }

        /// <summary>
        /// GuidValue: código GUID utilizado para identificar el registro de un dominio a otro 
        /// </summary>
        public virtual Guid GuidValue
        {
            get
            {
                if (_Guid == Guid.Empty)
                {
                    _Guid = Guid.NewGuid();
                    return _Guid;
                }
                return _Guid;
            }
            protected set
            {
                _Guid = value;
            }
        }

        private List<INotification> _domainEvents;
        public IReadOnlyCollection<INotification> DomainEvents => _domainEvents?.AsReadOnly();

        private List<string> _errors;
        public IReadOnlyCollection<string> Errors => _errors?.AsReadOnly();

        public void AddDomainEvent(INotification eventItem)
        {
            _domainEvents = _domainEvents ?? new List<INotification>();
            _domainEvents.Add(eventItem);
        }

        public void RemoveDomainEvent(INotification eventItem)
        {
            _domainEvents?.Remove(eventItem);
        }

        public void ClearDomainEvents()
        {
            _domainEvents?.Clear();
        }

        public bool IsTransient()
        {
            return this.Id == default(Int32);
        }

        public override bool Equals(object obj)
        {
            if (obj == null || !(obj is Entity))
                return false;

            if (Object.ReferenceEquals(this, obj))
                return true;

            if (this.GetType() != obj.GetType())
                return false;

            Entity item = (Entity)obj;

            if (item.IsTransient() || this.IsTransient())
                return false;
            else
                return item.Id == this.Id;
        }

        public override int GetHashCode()
        {
            if (!IsTransient())
            {
                if (!_requestedHashCode.HasValue)
                    _requestedHashCode = this.Id.GetHashCode() ^ 31; // XOR for random distribution (http://blogs.msdn.com/b/ericlippert/archive/2011/02/28/guidelines-and-rules-for-gethashcode.aspx)

                return _requestedHashCode.Value;
            }
            else
                return base.GetHashCode();

        }
        public static bool operator ==(Entity left, Entity right)
        {
            if (Object.Equals(left, null))
                return (Object.Equals(right, null)) ? true : false;
            else
                return left.Equals(right);
        }

        public static bool operator !=(Entity left, Entity right)
        {
            return !(left == right);
        }

        public virtual void SetAuditoria(Guid? usuario, DateTime? fecha, string ip)
        {
            if (Id == 0)
            {
                UsuarioCreacion = usuario.Value;
                FechaCreacion = fecha.Value;
                IpCreacion = ip;
            }
            else
            {
                UsuarioModificacion = usuario;
                FechaModificacion = fecha;
                IpModificacion = ip;
            }
        }
    }

    public abstract class AuditoriaEntity
    {
        public Guid UsuarioCreacion { get; set; }
        public DateTime FechaCreacion { get; set; }
        public string IpCreacion { get; set; }
        public Guid? UsuarioModificacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public string IpModificacion { get; set; }
    }
}
