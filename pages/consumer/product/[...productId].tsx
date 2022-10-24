import * as React from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  isProductIdVairant,
  getProductVairant,
  productRedirectTo,
  productSeoName,
  showProduct,
  getSupportUrl,
} from "utils";

let url = "/consumer/product";

export async function getServerSideProps(context) {
  const resolvedUrl = context.resolvedUrl;
  const { data } = await showProduct(false);
  const { productId } = context.params;
  let seoName = "";
  let supportUrl = "";
  const productUrl = productId.join(",")?.replace("-", ",")?.split(",");
  console.log("productUrl", productUrl);

  /*
    PO/12 in url
  */
  if (!isProductIdVairant(productId[0])) {

    console.log("productId if 1", productId);
    const productIdwithVariant = getProductVairant(productUrl, 2);
    seoName = productSeoName(data.seoName, productUrl);
    supportUrl = getSupportUrl(resolvedUrl);
    return productRedirectTo({
      url,
      productIdwithVariant,
      seoName,
      supportUrl,
    });
  }
  // PO_12 in url
  if (
    isProductIdVairant(productId[0]) &&
    data.seoName &&
    data.seoName !== productUrl[1]
  ) {
    console.log("productId if 2", productId);
    const productIdwithVariant = getProductVairant(productUrl, 1);
    seoName = productSeoName(data.seoName, productUrl);
    supportUrl = getSupportUrl(resolvedUrl);
    return productRedirectTo({
      url,
      productIdwithVariant,
      seoName,
      supportUrl,
    });
  }
  const productUrlNew = productUrl.filter(
    (i, index) => index === 0 || i == "support"
  );
  if (!data.seoName && productUrlNew.length <  productUrl.length  ) {
    console.log("productUrlNew if 3", productUrlNew);
    supportUrl = getSupportUrl(resolvedUrl);
    const productIdwithVariant = getProductVairant(productUrl, 1)
    return productRedirectTo({
      url,
      productIdwithVariant,
      seoName,
      supportUrl,
    });
  }

  return {
    props: {
      resolvedUrl: resolvedUrl,
      productUrl: productUrl,
      isProductIdVairant: isProductIdVairant(productId[0]),
      productInfo: data,
      isSupport: resolvedUrl.includes("support"),
    },
  };
}

function ProductPage({
  productUrl,
  isProductIdVairant,
  isSupport,
  productInfo,
  resolvedUrl,
}) {
  return <div>{isSupport ? "Support Page" : "Product Page"}</div>;
}

export default ProductPage;
