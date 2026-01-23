db = db.getSiblingDB("support_prod");

db.createUser({
  user: "admin",
  pwd: "fjzadmin2026",
  roles: [
    {
      role: "readWrite",
      db: "support_prod"
    }
  ]
});

print("✅ Production Mongo user created");
