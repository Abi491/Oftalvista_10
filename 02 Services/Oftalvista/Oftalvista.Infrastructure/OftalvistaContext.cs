using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Oftalvista.Domain.AggregatesModel.AgendaMedicaAggregate;
using Oftalvista.Domain.AggregatesModel.CitaAggregate;
using Oftalvista.Domain.AggregatesModel.EspecialidadMedicaAggregate;
using Oftalvista.Domain.AggregatesModel.HistorialCitaAggregate;
using Oftalvista.Domain.AggregatesModel.MedicoAggregate;
using Oftalvista.Domain.AggregatesModel.PacienteAggregate;
using Oftalvista.Domain.AggregatesModel.PagoCitaAggregate;
using Oftalvista.Domain.AggregatesModel.RecordatorioCitaAggregate;
using Oftalvista.Domain.AggregatesModel.UsuarioAggregate;
using Oftalvista.Domain.SeedWork;
using Oftalvista.Infrastructure.EntityConfigurations;
using System.Data;

namespace Oftalvista.Infrastructure
{
    public class OftalvistaContext : DbContext, IUnitOfWork
    {
        public const string DEFAULT_SCHEMA = "maestro";
        private readonly IMediator _mediator;
        private IDbContextTransaction _currentTransaction;
        public IDbContextTransaction GetCurrentTransaction => _currentTransaction;
        public bool HasActiveTransaction => _currentTransaction != null;

        public DbSet<AgendaMedica> AgendaMedica { get; set; }
        public DbSet<Cita> Cita { get; set; }
        public DbSet<EspecialidadMedica> EspecialidadMedica { get; set; }
        public DbSet<HistorialCita> HistorialCita { get; set; }
        public DbSet<Medico> Medico { get; set; }
        public DbSet<Paciente> Paciente { get; set; }
        public DbSet<PagoCita> PagoCita { get; set; }
        public DbSet<RecordatorioCita> RecordatorioCita { get; set; }
        public DbSet<Usuario> Usuario { get; set; }

        private OftalvistaContext(DbContextOptions<OftalvistaContext> options) : base(options) { }
        public OftalvistaContext(DbContextOptions<OftalvistaContext> options, IMediator mediator) : base(options)
        {
            _mediator = mediator ?? throw new ArgumentNullException(nameof(mediator));

            System.Diagnostics.Debug.WriteLine("OftalvistaContext::ctor ->" + this.GetHashCode());
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new AgendaMedicaEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new CitaEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new EspecialidadMedicaEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new HistorialCitaEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new MedicoEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new PacienteEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new PagoCitaEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new RecordatorioCitaEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new UsuarioEntityTypeConfiguration());
        }
        public async Task<bool> SaveEntitiesAsync(CancellationToken cancellationToken = default(CancellationToken))
        {

            // Despacho de la colección de eventos de dominio.
            // Opciones:
            // A) ANTES de hacer comit los datos en la DB (EF SaveChanges)  realizará una sola transacción, incluida
            // efectos secundarios de los controladores de eventos de dominio que usan el mismo DbContext con "InstancePerLifetimeScope" o "scoped" siempre
            // B) DESPUÉS de enviar datos en la DB (EF SaveChanges) se realizarán varias transacciones.
            // Tendrá que manejar la coherencia final y las acciones compensatorias en caso de fallas en cualquiera de los Manejadores.
            await _mediator.DispatchDomainEventsAsync(this);

            // Después de ejecutar esta línea todos los cambios (desde el Controlador de comandos y los Controladores de eventos de dominio)
            // realizado a través del DbContext se comprometerá (concretará, comitiará)
            var result = await base.SaveChangesAsync();

            return true;
        }
        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            if (_currentTransaction != null) return null;

            _currentTransaction = await Database.BeginTransactionAsync(IsolationLevel.ReadCommitted);

            return _currentTransaction;
        }
        public async Task CommitTransactionAsync(IDbContextTransaction transaction)
        {
            if (transaction == null) throw new ArgumentNullException(nameof(transaction));
            if (transaction != _currentTransaction) throw new InvalidOperationException($"La Transacción {transaction.TransactionId} no es la actual");

            try
            {
                await SaveChangesAsync();
                transaction.Commit();
            }
            catch
            {
                RollbackTransaction();
                throw;
            }
            finally
            {
                if (_currentTransaction != null)
                {
                    _currentTransaction.Dispose();
                    _currentTransaction = null;
                }
            }
        }
        public void RollbackTransaction()
        {
            try
            {
                _currentTransaction?.Rollback();
            }
            finally
            {
                if (_currentTransaction != null)
                {
                    _currentTransaction.Dispose();
                    _currentTransaction = null;
                }
            }
        }
    }

    public static class Schema
    {
        public static string Maestro = "maestro";
        public static string Transaccional = "transaccional";
        public static string Sistema = "sistema";
        public static string Seguridad = "seguridad";
        public static string Externo = "externo";
    }
}