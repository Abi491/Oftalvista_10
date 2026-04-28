using System;
using System.Collections.Generic;

namespace Oftalvista.Core
{    
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public abstract class ValidatorDictionary : Attribute
    {        
        public abstract bool Validate(object input, out string mensaje);
    }            
}
