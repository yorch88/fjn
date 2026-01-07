import secrets
import string

def generar_api_key(longitud=32):
    """
    Generates a secure API Key.

    :param longitud: Length of the key (default is 32 characters)
    :return: Secure random string
    """
    if not isinstance(longitud, int) or longitud <= 0:
        raise ValueError("La longitud debe ser un número entero positivo.")

    characters = string.ascii_letters + string.digits

    # Generate secure key
    api_key = ''.join(secrets.choice(characters) for _ in range(longitud))
    return api_key

if __name__ == "__main__":
    try:
        key = generar_api_key(40)  # You can change the length
        print(f"API Key generated: {key}")
    except Exception as e:
        print(f"Error: {e}")
