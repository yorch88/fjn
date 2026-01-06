def normalize_clock(value):
    """
    Normaliza clock_num para evitar listas/tuplas como ['555'].
    Siempre regresa un string o None.
    """
    if value is None:
        return None

    if isinstance(value, (list, tuple)):
        return str(value[0])

    return str(value)
