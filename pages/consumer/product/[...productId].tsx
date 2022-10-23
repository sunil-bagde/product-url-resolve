import * as React from "react";
import axios from "axios";
import { useRouter } from "next/router";

const isProductIdVairant = (id: string) => {
  return id.includes("_");
};
const getProductVairant = (productUrl, index = 2) => {
  return productUrl.slice(0, index).join("_");
};
const getSupportUrl = (resolvedUrl) => {
  const supportText = "support";
  if (resolvedUrl.includes(supportText)) {
    return "/" + supportText;
  }
  return "";
};

const productRedirectTo = ({
  url,
  productIdwithVariant,
  seoName,
  supportUrl,
}) => {
  return {
    redirect: {
      destination: `${url}/${productIdwithVariant}${seoName}${supportUrl}`,
      permanent: false,
    },
  };
};
const productSeoName = (seoName = "", productUrl) => {
  const indexOfHyphen = productUrl.indexOf("-");
  let newSeoName = seoName;
  if (newSeoName) {
    newSeoName = `-${newSeoName}`;
  }
  if (!newSeoName && indexOfHyphen !== -1) {
    newSeoName = "";
  }
  return newSeoName;
};
const showProduct = async (hasName: boolean) => {
  if (!hasName) {
    return { data: {} };
  }
  return await axios.get("http://localhost:3000/api/show-product");
};
let url = "/consumer/product";

export async function getServerSideProps(context) {
  const resolvedUrl = context.resolvedUrl;
  const { data } = await showProduct(false);
  const { productId } = context.params;
  let seoName = "";
  let supportUrl = "";
  const productUrl = productId.join(",")?.replace("-", ",")?.split(",");

  if (!isProductIdVairant(productId[0])) {
    // PO/12 in url
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
  if (
    isProductIdVairant(productId[0]) &&
    data.seoName &&
    data.seoName !== productUrl[1]
  ) {
    // PO/12 in url
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

  if (!data.seoName && productUrlNew.length == 1 && productUrl.length > 1) {
    supportUrl = getSupportUrl(resolvedUrl);
    const productIdwithVariant = productUrl.slice(0, 1).join("_");
    return productRedirectTo({
      url,
      productIdwithVariant,
      seoName,
      supportUrl,
    });
  }
  if (!data.seoName && productUrlNew.length <= 2 && productUrl.length > 2) {
    console.log("productUrlNew if 3", productUrlNew);
    supportUrl = getSupportUrl(resolvedUrl);
    const productIdwithVariant = productUrl.slice(0, 1).join("_");
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
