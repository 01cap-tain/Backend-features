import express from "express";
const router = express();

const baseUrl = "/";
router.get("/login/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const products = [
    {
      id: 1,
      item: "shoe",
      product: 1,
    },
    {
      id: 1,
      item: "shoe",
      product: 1,
    },
    {
      id: 1,
      item: "shoe",
      product: 1,
    },
  ];
  const singleProduct = products.find((product) => product.id === productId);

  if (singleProduct) {
    res.json(singleProduct);
  } else {
    res.status(404).send("NOt found");
  }
});

export default router;
