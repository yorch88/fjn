from bson import ObjectId

def normalize_mongo_doc(obj):

    if isinstance(obj, ObjectId):
        return str(obj)

    if isinstance(obj, list):
        return [normalize_mongo_doc(i) for i in obj]

    if isinstance(obj, dict):
        new = {}
        for k, v in obj.items():
            new[k] = normalize_mongo_doc(v)
        return new

    return obj
