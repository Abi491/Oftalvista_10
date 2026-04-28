namespace Oftalvista.Core
{
    public interface IValidator<TEntidad> where TEntidad : IValidable 
    {
        ValidationResult Validar(TEntidad entidad);
    }
}
