// login.js
const jwt = require("jsonwebtoken");
const secretKey = "1234TokenSecret";
module.exports = (req, res, next) => {
  const { url } = req;
  const allData = require("./db.json");
  let check = ["/login", "auth/login", "/api/auth/login"];
  if (check.some((s) => url.includes(s))) {
    if (req.method === "POST") {
      return login(req, res);
    }
  }
  if (url.includes("/bitacoras") && !url.includes("/bitacoras/")) {
    const data = allData.bitacoras;
    return paginar(req, res, data);
  }
  if (url.includes("/bitacoras/config")) {
    data = allData.config;
    return res.json(data);
  }
  if (url.includes("bitacoras/viewBitacora/")) {
    const id = url.split("/").pop();
    data = allData.bitacoras.find((item) => item.id == id);
    return res.json(data);
  }
  if (url.includes("/brigadas") && !url.includes("/brigadas/")) {
    const data = allData.brigadas;
    return paginar(req, res, data);
  }
  if (url.includes("/brigadas/brigadaactiva")) {
    const data = [allData.brigadaactiva];
    return paginar(req, res, data);
  }
  if (
    url.includes("/sitesautocomplete") &&
    !url.includes("/sitesautocomplete/")
  ) {
    const data = allData.sites;
    return paginar(req, res, data);
  }
  next();
};

const login = (req, res) => {
  const access_token = jwt.sign(req.body, secretKey);
  return res.json({
    access_token,
    user: {
      name: "Fake",
      surname: "User",
      email: req.body.email,
      roles: ["Admin", "User"],
      permissions: ["read", "write"],
    },
  });
};

const paginar = (req, res, data) => {
  const { page, limit } = req.query;
  const pageNumber = isNaN(parseInt(page, 10)) ? 1 : parseInt(page, 10);
  const limitNumber = isNaN(parseInt(limit, 10))
    ? data.length
    : parseInt(limit, 10);
  // Calcular el total de elementos y la paginación
  const total = data.length;
  const start = (pageNumber - 1) * limitNumber;
  const end = pageNumber * limitNumber;
  const paginatedData = data.slice(start, end);
  return res.status(200).json({
    total,
    page: pageNumber,
    limit: limitNumber,
    data: paginatedData,
  });
};
