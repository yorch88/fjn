import secrets
import string

def generar_api_key(longitud=32):
    """
    Genera un API Key seguro.
    
    :param longitud: Longitud de la clave (por defecto 32 caracteres)
    :return: Cadena segura aleatoria
    """
    if not isinstance(longitud, int) or longitud <= 0:
        raise ValueError("La longitud debe ser un número entero positivo.")

    # Caracteres permitidos: letras mayúsculas, minúsculas y dígitos
    caracteres = string.ascii_letters + string.digits

    # Generar clave segura
    api_key = ''.join(secrets.choice(caracteres) for _ in range(longitud))
    return api_key

if __name__ == "__main__":
    try:
        clave = generar_api_key(40)  # Puedes cambiar la longitud
        print(f"API Key generada: {clave}")
    except Exception as e:
        print(f"Error: {e}")
