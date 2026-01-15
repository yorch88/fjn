def build_location_code(loc):
    return f"{loc['zone']}-{loc['aisle']}-{loc['rack']}-{loc['level']}-{loc['position']}"